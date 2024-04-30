const supertest = require('supertest');
const chai = require('chai');
const {app} = require('../app'); // Import your app

const expect = chai.expect;
const request = supertest(app);

describe('User Routes', function() {
    describe('POST /trackLogin', function() {
        it('should track login', function(done) {
            request.post('/user/trackLogin')
                .send({ accountNumber: '123456' })
                .end(function(err, res) {
                    expect(res.statusCode).to.equal(200);
                    // Add more assertions as needed
                    done();
                });
        });
    });

    // Add more tests for other routes...
});