const puppeteer = require('puppeteer');
const encrypt = require('./password');

// const password = 'aleproteus';

(async () => {
	let browser = await puppeteer.launch();
	let page = await browser.newPage();

	await page.goto('https://proteus-eretes.nl/login');

	await page.screenshot('login.png');

	await page.type('#user', 'abeldebruijn@hotmail.com');
	await page.type('#pass', encrypt.password);
	await page.click('[type=submit]');

	await page.goto('https://proteus-eretes.nl/afschrijfboek?d=2020-02-10&s=16');

	let texts = await page.evaluate(() => {
		let data = [];
		let elements = document.getElementsByTagName('form');
		for (var element of elements) {
			if (element.id.match('res')) {
				const header = element.getElementsByClassName('block-proteus-orange')[0].id;
				const firstTime = element.getElementsByClassName('ui-slider-pip-first')[0].innerText;
				const lastTime = element.getElementsByClassName('ui-slider-pip-last')[0].innerText;
				const time = (element.getElementsByClassName('afschrijfboek_datetime')[0].value = '15:30 - 16:30');

				const reservedAreas = element.getElementsByClassName('reserved-area');

				data.push({ header, firstTime, lastTime, time });
			}
		}
		return data;
	});

	texts.forEach((form) => {
		console.table(form);
	});
})();
