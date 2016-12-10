var request = require('request');

describe("Test /getMap", function () {
	it("returns status code 200 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=Trento&arrival=valsugana&mode=walking"
		}, function (error, response, body) {
			expect(response.statusCode == 200 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 404 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=Trento&arrival=mmm&mode=walking"
		}, function (error, response, body) {
			expect(response.statusCode == 404 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 404 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=errore&arrival=povo&mode=walking"
		}, function (error, response, body) {
			expect(response.statusCode == 404 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 404 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=errore&arrival=povo&mode=nessunmodo"
		}, function (error, response, body) {
			expect(response.statusCode == 404 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=errore&arrival=povo"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=errore"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "none"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getMap',
			body: "departure=123&arrival=456&mode=789"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});
});

describe("Test /getUserLocation", function () {
	it("returns status code 200 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getUserLocation',
			body: "latitude=45.538251699999996&longitude=11.1557859"
		}, function (error, response, body) {
			expect(response.statusCode == 200 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getUserLocation',
			body: "latitude=&longitude=11.1557859"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getUserLocation',
			body: "longitude="
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getUserLocation',
			body: "latitude=someString&longitude=11.1557859"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});

	it("returns status code 449 or 503", function (done) {
		request.post({
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			url: 'http://127.0.0.1:5000/getUserLocation',
			body: "none"
		}, function (error, response, body) {
			expect(response.statusCode == 449 || response.statusCode == 503).toBeTruthy();
			done();
		});
	});
});
