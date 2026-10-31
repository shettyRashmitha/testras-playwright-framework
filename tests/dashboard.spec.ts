import {test,expect} from '@playwright/test';
import {Routes} from '@shared/routes';

test('admin lands on the dashboard',{tag: ['@smoke']},async({page})=>{
    //Act
    await page.goto(Routes.dashboard);

    //Assert
    await expect(page).not.toHaveURL(Routes.login);
    await expect(page.locator('.oxd-brand-banner')).toBeVisible();
});