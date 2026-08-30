import { HERO_FOOD_IMAGE, CHEF_IMAGES, DISH_IMAGES } from '../../lib/images';

describe('images utility', () => {
  it('should export HERO_FOOD_IMAGE', () => {
    expect(typeof HERO_FOOD_IMAGE).toBe('string');
    expect(HERO_FOOD_IMAGE.length).toBeGreaterThan(0);
  });

  it('should have default CHEF_IMAGES', () => {
    expect(CHEF_IMAGES.default).toBeDefined();
    expect(typeof CHEF_IMAGES['1']).toBe('string');
  });

  it('should have default DISH_IMAGES', () => {
    expect(DISH_IMAGES.default).toBeDefined();
    expect(typeof DISH_IMAGES['101']).toBe('string');
  });
});
