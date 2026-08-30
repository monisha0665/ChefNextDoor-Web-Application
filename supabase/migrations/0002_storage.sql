-- =====================================================================
-- Storage — replaces any file-upload code you'd otherwise have written
-- in Flask. Two public-read buckets: chef profile photos and menu item
-- photos. Both allow public read (needed to render images on the
-- public-facing browse/profile pages) but writes are restricted to the
-- owning chef.
-- =====================================================================

insert into storage.buckets (id, name, public)
values
    ('chef-profile-images', 'chef-profile-images', true),
    ('menu-item-images', 'menu-item-images', true)
on conflict (id) do nothing;

-- Anyone can view images in either bucket
create policy "public read chef profile images"
    on storage.objects for select
    using (bucket_id = 'chef-profile-images');

create policy "public read menu item images"
    on storage.objects for select
    using (bucket_id = 'menu-item-images');

-- A chef may only upload/update/delete files inside a folder named after
-- their own user id, e.g. chef-profile-images/<chef_id>/avatar.jpg —
-- enforced by checking the first path segment against auth.uid().
create policy "chefs upload their own profile image"
    on storage.objects for insert
    with check (
        bucket_id = 'chef-profile-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "chefs update their own profile image"
    on storage.objects for update
    using (
        bucket_id = 'chef-profile-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "chefs upload their own menu item images"
    on storage.objects for insert
    with check (
        bucket_id = 'menu-item-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

create policy "chefs update their own menu item images"
    on storage.objects for update
    using (
        bucket_id = 'menu-item-images'
        and (storage.foldername(name))[1] = auth.uid()::text
    );
