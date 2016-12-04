var request = require('request');

describe("Test /getMap", function () {
    it("returns status code 200", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "departure=Trento&arrival=valsugana&mode=walking"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    it("returns status code 404", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "departure=Trento&arrival=mmm&mode=walking"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it("returns status code 404", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "departure=errore&arrival=povo&mode=walking"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it("returns status code 404", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "departure=errore&arrival=povo&mode=nessunmodo"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(404);
            done();
        });
    });

    it("returns status code 500", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "departure=errore&arrival=povo"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(500);
            done();
        });
    });

    it("returns status code 500", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "departure=errore"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(500);
            done();
        });
    });

    it("returns status code 500", function (done) {
        request.post({
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            url: 'http://127.0.0.1:5000/getMap',
            body: "none"
        }, function (error, response, body) {
            expect(response.statusCode).toBe(500);
            done();
        });
    });
});