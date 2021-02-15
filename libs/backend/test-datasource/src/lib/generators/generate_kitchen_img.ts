import { Chance } from 'chance';

export const generate_kitchen_imgs = (amount: number) => {
    const all_kitchen_imgs = [
        'https://i.ibb.co/dQp5kkG/5-Agashiye.jpg',
        'https://i.ibb.co/bLdVdKv/9-copy.jpg',
        'https://i.ibb.co/M1rXLRn/636975790419993252-JIEp-ND.jpg',
        'https://i.ibb.co/WchJDCQ/636975790419993252wyey4z.jpg',
        'https://i.ibb.co/RjDzmtk/Avartana-ITC-Grand-Chola-Chennai-top-restaurants-in-India-best-restaurants-in-India.jpg',
        'https://i.ibb.co/CPGgTWN/britannia-and-co-57dbb41c5f9b5865164e5c1a.jpg',
        'https://i.ibb.co/0rKLf4Z/chavadi-cover-pic-647-090115063451.webp',
        'https://i.ibb.co/bmDB62M/Checking-out-some-of-Indias-most-incredible-restaurants-Image-2.webp',
        'https://i.ibb.co/p1ZVV8r/content6629.jpg',
        'https://i.ibb.co/4gWMQQQ/delhi-restaurant.jpg',
        'https://i.ibb.co/qRGT6r2/Getty-Images-664302116.jpg',
        'https://i.ibb.co/fYMLD1V/greaves-best-indian-restaurants-karavalli.jpg',
        'https://i.ibb.co/fMwhNyM/image.jpg',
        'https://i.ibb.co/KzwTj07/Indian-Accent-of-New-Delhi.jpg',
        'https://i.ibb.co/gVg2QhM/india-pavilion-fb-660x400.jpg',
        'https://i.ibb.co/W5fjkMj/India-themed-restaurants.jpg',
        'https://i.ibb.co/XWfxT1t/jpg.jpg',
        'https://i.ibb.co/b5MB772/news17279.jpg',
        'https://i.ibb.co/KV3vjX4/Pek.jpg',
        'https://i.ibb.co/yypV46T/restaurant-2-1-660-070420051845.jpg',
        'https://i.ibb.co/KXV28H8/restaurant-625x350-41444894654.webp',
        'https://i.ibb.co/WfC3ZJX/The-Private-Dining-Room-Indian-Accent-at-The-Lodhi-high-1366x768.jpg',
    ];

    if (amount < 1) {
        return [];
    }

    const img_to_return: string[] = [];
    const chance = new Chance();
    for (let index = 0; index < amount; index++) {
        img_to_return.push(chance.pickone(all_kitchen_imgs));
    }

    return img_to_return;
};
