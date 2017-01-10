'use strict';

const chai = require('chai');
const expect = chai.expect;
const mainController = require('./../src/main.js');

describe('A useless test', function uselessTestFunction() {
	let result;

	before(function* getParsedProductSuccessBefore() {
		result = yield mainController();
	});

	it('should pass, just because', function whyNot() {
		expect(result.response).to.equal('What else do you want me to do for you?  Get to it!');
	});
});
