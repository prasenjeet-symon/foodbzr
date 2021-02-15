import { Chance } from 'chance';

export const generate_food_img = (amount: number) => {
    const all_food_imgs = [
        'https://i.ibb.co/7rHxkN0/26-traditional-indian-foods-that-will-change-your-1-7312-1403550756-15-big.jpg',
        'https://i.ibb.co/jwmZsQ3/29d1fac9-1225-4b23-baaa-98b8550be1b9-indian-food.jpg',
        'https://i.ibb.co/PTKnkK8/824-8-Healthy-Indian-Foods-To-Keep-You-Fit-i-Stock-495455658.jpg,',
        'https://i.ibb.co/G2XfZZ3/1800x1200-best-and-worst-indian-dishes-for-your-health-slideshow.jpg',
        'https://i.ibb.co/nrfSGrH/324031-607b4dc552822ecaa66877afedf7793abae4e343-jpg-facebook.jpg',
        'https://i.ibb.co/DfKzFyK/20200205-beef-curry-ehg-9732-jpg-1582823107.jpg',
        'https://i.ibb.co/Df0DN63/77563051.jpg',
        'https://i.ibb.co/xX8q1PT/a0000458-main.jpg',
        'https://i.ibb.co/XZkgKqs/African-Foods-Lead.jpg',
        'https://i.ibb.co/nDdjGr4/biryani-1580551590005.webp',
        'https://i.ibb.co/fvjyH5h/Cover-idly-dosa-indai-restuarnt-in-yourphnompenh-online-ordering.jpg',
        'https://i.ibb.co/s9Qhg37/d0e6a0a79d5f4197a51f4ca065393ffe.jpg',
        'https://i.ibb.co/rFcH52X/dc362c49-d8f5-42ac-9ae8-a382fa651e02.jpg',
        'https://i.ibb.co/RbDmkPF/dish-story-647-081417052301.jpg',
        'https://i.ibb.co/GM0jLnV/dosa-crispy-savory-pancake-from-south-india-image-shot-032012-exact-date-unknown-51490d5b19.jpg',
        'https://i.ibb.co/HPjgWf0/Dum-Aloo-e163632.jpg',
        'https://i.ibb.co/bJF0Mjd/f3cb9614e35b516f510c65db2304aeda.jpg',
        'https://i.ibb.co/DQP3TW2/Processed-with-VSCO-with-4-preset.jpg',
        'https://i.ibb.co/fvjyH5h/Cover-idly-dosa-indai-restuarnt-in-yourphnompenh-online-ordering.jpg',
        'https://i.ibb.co/fFgWMhR/img-2138-original-splash-feature-1531910328.jpg',
        'https://i.ibb.co/FH6CWnF/indian-10f0c14.jpg',
        'https://i.ibb.co/3m8DyZg/indian-dinner.jpg',
        'https://i.ibb.co/ky8vNmN/indian-food-625-625x350-51448018868.jpg',
        'https://i.ibb.co/DCYJC7N/indian-food-640.jpg',
        'https://i.ibb.co/fq2gQLb/indian-food-in-Lhasa.jpg',
        'https://i.ibb.co/JR3QVmk/indian-food-mohans1995-wikicommons.jpg',
        'https://i.ibb.co/K0V9mrS/indian-foods-loved-by-foreigners.jpg',
        'https://i.ibb.co/Rv1vkpw/assorted-indian-dish.jpg',
        'https://i.ibb.co/qkCnKvS/Assorted-Indian-recipes-food-various-with-spices-and-rice-on-wooden-table.jpg',
        'https://i.ibb.co/kG6ZJFN/most-popular-indian-dishes.jpg',
        'https://i.ibb.co/6bzHXPg/p07cj8zj-1.jpg',
        'https://i.ibb.co/6bzHXPg/p07cj8zj-1.jpg',
        'https://i.ibb.co/CPVn0kr/paneer-makhani-or-shahi-paneer-indian-food-670906899-5878ef725f9b584db3d890f4.jpg',
        'https://i.ibb.co/R6gPfkY/pexels-photo-2474661.jpg',
        'https://i.ibb.co/V932jyH/shutterstock-1435374326.jpg',
        'https://i.ibb.co/1086h6M/Slow-Cooker-Butter-Chicken.jpg',
        'https://i.ibb.co/SsFQzdp/ti8wzfbbvdspxo8dg1ci.jpg',
    ];

    if (amount < 1) {
        return [];
    }

    const chance = new Chance();
    const img_to_return: string[] = [];
    for (let index = 0; index < amount; index++) {
        img_to_return.push(chance.pickone(all_food_imgs));
    }

    return img_to_return;
};
