-- =====================================================================
-- ChefNextDoor — Supabase schema
-- Run via: supabase db push   (or paste into the Supabase SQL Editor)
--
-- Key differences from a plain Postgres schema:
--   * Every "user" table is keyed by auth.users.id (UUID), not SERIAL.
--     Supabase Auth owns email/password — we never store password_hash
--     ourselves.
--   * Row Level Security (RLS) replaces the old Flask-JWT route guards —
--     since the frontend now talks to the database directly (via
--     supabase-js) or through Edge Functions, Postgres itself enforces
--     who can read/write what.
--   * Triggers replace some of what Flask controllers used to do
--     manually (e.g. writing a notification row on order status change).
-- =====================================================================

create extension if not exists "uuid-ossp";

create type order_status as enum ('Pending','Accepted','Preparing','On the Way','Delivered','Cancelled');
create type payment_method as enum ('cash','online','bkash');
create type payment_status as enum ('pending','paid','failed','refunded');
create type user_role as enum ('customer','chef','admin','delivery_partner');
create type chef_status as enum ('pending','active','blocked');

-- ---------------------------------------------------------------------
-- 1. Profiles — one row per auth.users, telling us which role they are
--    and pointing at their role-specific table. This is what the
--    Factory Edge Function writes to.
-- ---------------------------------------------------------------------
create table tbl_profile (
    user_id     uuid primary key references auth.users(id) on delete cascade,
    role        user_role not null,
    name        varchar(100) not null,
    phone       varchar(20) unique,
    created_at  timestamptz not null default now()
);

-- 2. Customers
create table tbl_customer (
    customer_id      uuid primary key references tbl_profile(user_id) on delete cascade,
    delivery_address text,
    loyalty_points   integer not null default 0 check (loyalty_points >= 0)
);

-- 3. Chefs
create table tbl_chef (
    chef_id        uuid primary key references tbl_profile(user_id) on delete cascade,
    specialty      varchar(100) not null,
    bio            text,
    profile_image  text,               -- Supabase Storage object path
    status         chef_status not null default 'pending',
    rating_avg     numeric(2,1) not null default 0.0 check (rating_avg between 0 and 5)
);

-- 4. Admins
create table tbl_admin (
    admin_id      uuid primary key references tbl_profile(user_id) on delete cascade,
    access_level  varchar(20) not null default 'standard'
);

-- 5. Delivery Partners
create table tbl_delivery_partner (
    partner_id    uuid primary key references tbl_profile(user_id) on delete cascade,
    vehicle_type  varchar(50) not null,
    is_available  boolean not null default true
);

-- 6. Categories
create table tbl_category (
    category_id  serial primary key,
    name         varchar(50) not null unique
);

-- 7. Menu Items
create table tbl_menu_item (
    menu_item_id  serial primary key,
    chef_id       uuid not null references tbl_chef(chef_id) on delete cascade,
    category_id   integer references tbl_category(category_id) on delete set null,
    name          varchar(120) not null,
    description   text,
    price         numeric(10,2) not null check (price > 0),
    image_url     text,               -- Supabase Storage object path
    is_available  boolean not null default true,
    created_at    timestamptz not null default now()
);

-- 8. Orders
create table tbl_order (
    order_id          serial primary key,
    customer_id       uuid not null references tbl_customer(customer_id),
    chef_id           uuid not null references tbl_chef(chef_id),
    partner_id        uuid references tbl_delivery_partner(partner_id),
    status            order_status not null default 'Pending',
    delivery_address  text not null,
    subtotal          numeric(10,2) not null check (subtotal >= 0),
    delivery_fee      numeric(10,2) not null default 40.00,
    discount          numeric(10,2) not null default 0.00,
    total             numeric(10,2) not null check (total >= 0),
    placed_at         timestamptz not null default now(),
    delivered_at      timestamptz
);

-- 9. Order Items
create table tbl_order_item (
    order_item_id  serial primary key,
    order_id       integer not null references tbl_order(order_id) on delete cascade,
    menu_item_id   integer not null references tbl_menu_item(menu_item_id),
    quantity       integer not null check (quantity > 0),
    unit_price     numeric(10,2) not null check (unit_price > 0)
);

-- 10. Payments
create table tbl_payment (
    payment_id      serial primary key,
    order_id        integer not null unique references tbl_order(order_id) on delete cascade,
    method          payment_method not null,
    status          payment_status not null default 'pending',
    transaction_id  varchar(100),
    amount          numeric(10,2) not null check (amount >= 0),
    paid_at         timestamptz
);

-- 11. Ratings
create table tbl_rating (
    rating_id     serial primary key,
    order_id      integer not null references tbl_order(order_id) on delete cascade,
    customer_id   uuid not null references tbl_customer(customer_id),
    chef_id       uuid not null references tbl_chef(chef_id),
    stars         smallint not null check (stars between 1 and 5),
    review_text   text,
    created_at    timestamptz not null default now(),
    unique (order_id, customer_id)
);

-- 12. Subscription Plans
create table tbl_subscription_plan (
    plan_id        serial primary key,
    name           varchar(80) not null,
    price          numeric(10,2) not null check (price >= 0),
    duration_days  integer not null check (duration_days > 0),
    benefits       text
);

-- 13. Customer Subscriptions
create table tbl_customer_subscription (
    subscription_id  serial primary key,
    customer_id      uuid not null references tbl_customer(customer_id) on delete cascade,
    plan_id          integer not null references tbl_subscription_plan(plan_id),
    started_at       timestamptz not null default now(),
    expires_at       timestamptz not null,
    is_active        boolean not null default true
);

-- 14. Chef Story
create table tbl_chef_story (
    story_id     serial primary key,
    chef_id      uuid not null unique references tbl_chef(chef_id) on delete cascade,
    headline     varchar(200),
    story_text   text,
    media_url    text,
    updated_at   timestamptz not null default now()
);

-- 15. Notifications — written by the Observer trigger below, read live
--     via Supabase Realtime on the frontend.
create table tbl_notification (
    notification_id  serial primary key,
    order_id         integer not null references tbl_order(order_id) on delete cascade,
    recipient_type   varchar(20) not null check (recipient_type in ('customer','chef','delivery_partner')),
    recipient_id     uuid not null,
    message          varchar(255) not null,
    is_read          boolean not null default false,
    created_at       timestamptz not null default now()
);

create index idx_menu_item_chef on tbl_menu_item(chef_id);
create index idx_order_customer on tbl_order(customer_id);
create index idx_order_chef on tbl_order(chef_id);
create index idx_order_status on tbl_order(status);
create index idx_notification_recipient on tbl_notification(recipient_type, recipient_id);

insert into tbl_category (name) values
    ('Bengali'), ('Chinese'), ('Bakery'), ('Vegan'), ('Grill'), ('Desserts')
on conflict (name) do nothing;

insert into tbl_subscription_plan (name, price, duration_days, benefits) values
    ('Neighbourhood Basic', 299.00, 30, 'Free delivery on orders over ৳300'),
    ('Neighbourhood Plus', 599.00, 30, 'Free delivery + 10% off every order')
on conflict do nothing;

-- =====================================================================
-- OBSERVER PATTERN, at the database layer
-- Whenever tbl_order.status changes, this trigger fans out a
-- notification row to whichever parties care — mirroring the same
-- CustomerNotifier / ChefDashboardNotifier / DeliveryPartnerNotifier
-- split used in the Edge Function version, but guaranteed to fire even
-- if a client updates the row directly (not just through our API).
-- =====================================================================
create or replace function fn_notify_order_status_change()
returns trigger
language plpgsql
security definer
as $$
begin
    if new.status is distinct from old.status then
        -- notify customer
        insert into tbl_notification (order_id, recipient_type, recipient_id, message)
        values (new.order_id, 'customer', new.customer_id,
                'Your order #' || new.order_id || ' is now ''' || new.status || '''.');

        -- notify chef
        insert into tbl_notification (order_id, recipient_type, recipient_id, message)
        values (new.order_id, 'chef', new.chef_id,
                'Order #' || new.order_id || ' status changed to ''' || new.status || '''.');

        -- notify delivery partner only once one is assigned, and only for
        -- the two statuses they actually act on
        if new.partner_id is not null and new.status in ('Preparing','On the Way') then
            insert into tbl_notification (order_id, recipient_type, recipient_id, message)
            values (new.order_id, 'delivery_partner', new.partner_id,
                    'Order #' || new.order_id || ' is ''' || new.status || '''.');
        end if;
    end if;
    return new;
end;
$$;

create trigger trg_order_status_notify
    after update on tbl_order
    for each row
    execute function fn_notify_order_status_change();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table tbl_profile enable row level security;
alter table tbl_customer enable row level security;
alter table tbl_chef enable row level security;
alter table tbl_admin enable row level security;
alter table tbl_delivery_partner enable row level security;
alter table tbl_menu_item enable row level security;
alter table tbl_order enable row level security;
alter table tbl_order_item enable row level security;
alter table tbl_payment enable row level security;
alter table tbl_rating enable row level security;
alter table tbl_notification enable row level security;
alter table tbl_chef_story enable row level security;

-- Profiles: anyone can read (needed to show chef names etc.), only the
-- owner (or our service-role Edge Functions) can write.
create policy "profiles are publicly readable" on tbl_profile
    for select using (true);
create policy "users manage their own profile" on tbl_profile
    for update using (auth.uid() = user_id);

-- Menu items: public read (browsing chefs doesn't require login);
-- only the owning chef can insert/update/delete their own items.
create policy "menu items are publicly readable" on tbl_menu_item
    for select using (true);
create policy "chefs manage their own menu" on tbl_menu_item
    for all using (auth.uid() = chef_id) with check (auth.uid() = chef_id);

-- Orders: a customer sees only their own orders; a chef sees only
-- orders placed with them; admins (checked via tbl_profile.role) see all.
create policy "customers see their own orders" on tbl_order
    for select using (auth.uid() = customer_id);
create policy "chefs see orders placed with them" on tbl_order
    for select using (auth.uid() = chef_id);
create policy "admins see all orders" on tbl_order
    for select using (
        exists (select 1 from tbl_profile p where p.user_id = auth.uid() and p.role = 'admin')
    );
-- Inserts/updates to tbl_order go through the place-order / update-order-status
-- Edge Functions using the service role key, which bypasses RLS by design —
-- so no customer-facing insert/update policy is defined here on purpose.

-- Notifications: recipients only see their own.
create policy "users see their own notifications" on tbl_notification
    for select using (auth.uid() = recipient_id);

-- Ratings: public read (for chef profile pages), customers write their own.
create policy "ratings are publicly readable" on tbl_rating
    for select using (true);
create policy "customers write their own ratings" on tbl_rating
    for insert with check (auth.uid() = customer_id);

-- Chef stories: public read, chef manages their own.
create policy "chef stories are publicly readable" on tbl_chef_story
    for select using (true);
create policy "chefs manage their own story" on tbl_chef_story
    for all using (auth.uid() = chef_id) with check (auth.uid() = chef_id);
