process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
JWT_EXPIRY = '24h';

require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
