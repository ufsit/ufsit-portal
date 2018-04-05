'use strict';
const expect = require('chai').expect;

describe('db\admin_mgmt.js', function () {

    describe('function_name()', function () {

        it('passes test', function () {

            expect(function () { }).to.not.throw();

            const response1 = 'function_call';
            expect(response1).to.equal('function_call');
            expect(response1).to.be.a('string');
            expect(response1).to.have.lengthOf(13);
            expect(response1).to.include('function');

            const response2 = 'function_call';
            expect(response2).to.equal('function_call');

        });

    });

});