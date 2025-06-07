const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const papersRouter = require('./papers'); // Assuming server.js and routers are in the same root
const { Paper } = require('../models/paper'); // Assuming models is in the root

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/papers', papersRouter);

// Import setup file - this will run beforeAll, afterAll, beforeEach
require('../tests/setup'); // Adjust path if necessary

describe('POST /papers', () => {
  it('should create a new paper with valid data', async () => {
    const paperData = {
      unitCode: 'CS101',
      yearTaken: '2023',
      unitTitle: 'Intro to Computer Science',
      fileLocation: '/path/to/file.pdf',
      classOfStudy: 'Undergraduate',
    };
    const res = await request(app)
      .post('/papers')
      .send(paperData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.unitCode).toBe(paperData.unitCode);

    // Verify data in the database
    const paperInDb = await Paper.findById(res.body._id);
    expect(paperInDb).toBeTruthy();
    expect(paperInDb.unitCode).toBe(paperData.unitCode);
  });

  it('should return 400 if required fields are missing', async () => {
    const paperData = {
      unitCode: 'CS102',
      // yearTaken is missing
      unitTitle: 'Data Structures',
      fileLocation: '/path/to/anotherfile.pdf',
      classOfStudy: 'Undergraduate',
    };
    const res = await request(app)
      .post('/papers')
      .send(paperData);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /papers', () => {
  it('should return 404 if no papers exist', async () => {
    const res = await request(app).get('/papers');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Papers NOT found');
  });

  it('should return all papers if papers exist', async () => {
    const paperData1 = {
      unitCode: 'CS101',
      yearTaken: '2023',
      unitTitle: 'Intro to CS',
      fileLocation: '/path/to/cs101.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paperData2 = {
      unitCode: 'MA202',
      yearTaken: '2024',
      unitTitle: 'Calculus II',
      fileLocation: '/path/to/ma202.pdf',
      classOfStudy: 'Undergraduate',
    };
    await Paper.create(paperData1);
    await Paper.create(paperData2);

    const res = await request(app).get('/papers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].unitCode).toBe(paperData1.unitCode);
    expect(res.body[1].unitCode).toBe(paperData2.unitCode);
  });
});

describe('GET /papers/:unitCode/:yearTaken', () => {
  it('should return a specific paper if found', async () => {
    const paperData = {
      unitCode: 'PHY201',
      yearTaken: '2023',
      unitTitle: 'Physics I',
      fileLocation: '/path/to/phy201.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paper = await Paper.create(paperData);

    const res = await request(app).get(`/papers/${paper.unitCode}/${paper.yearTaken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.unitCode).toBe(paperData.unitCode);
    expect(res.body.yearTaken).toBe(paperData.yearTaken);
  });

  it('should return 404 if a specific paper is not found', async () => {
    const res = await request(app).get('/papers/NONEXISTENT/2023');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Paper NOT found');
  });
});

describe('GET /papers/:unitCode', () => {
  it('should return all papers for a specific unitCode', async () => {
    const paperData1 = {
      unitCode: 'ENG101',
      yearTaken: '2023',
      unitTitle: 'English Composition',
      fileLocation: '/path/to/eng101_2023.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paperData2 = {
      unitCode: 'ENG101',
      yearTaken: '2024',
      unitTitle: 'English Composition',
      fileLocation: '/path/to/eng101_2024.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paperData3 = {
      unitCode: 'HIS202',
      yearTaken: '2023',
      unitTitle: 'World History',
      fileLocation: '/path/to/his202.pdf',
      classOfStudy: 'Undergraduate',
    };
    await Paper.create(paperData1);
    await Paper.create(paperData2);
    await Paper.create(paperData3);

    const res = await request(app).get(`/papers/ENG101`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].unitCode).toBe('ENG101');
    expect(res.body[1].unitCode).toBe('ENG101');
  });

  it('should return 404 if no papers are found for a specific unitCode', async () => {
    const res = await request(app).get('/papers/UNKNOWNUNIT');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Papers NOT found');
  });
});

describe('PUT /papers/:unitCode/:yearTaken', () => {
  it('should update an existing paper with valid data', async () => {
    const initialPaperData = {
      unitCode: 'BIO101',
      yearTaken: '2022',
      unitTitle: 'Introduction to Biology',
      fileLocation: '/path/to/bio101.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paper = await Paper.create(initialPaperData);

    const updatedData = {
      unitTitle: 'Advanced Biology',
      fileLocation: '/path/to/bio101_updated.pdf',
    };

    const res = await request(app)
      .put(`/papers/${paper.unitCode}/${paper.yearTaken}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.unitTitle).toBe(updatedData.unitTitle);
    expect(res.body.fileLocation).toBe(updatedData.fileLocation);

    // Verify data in the database
    const paperInDb = await Paper.findById(paper._id);
    expect(paperInDb.unitTitle).toBe(updatedData.unitTitle);
  });

  it('should return 404 if the paper to update is not found', async () => {
    const updatedData = {
      unitTitle: 'Non Existent Paper Update',
    };
    const res = await request(app)
      .put('/papers/NONEXISTENT/2022')
      .send(updatedData);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Paper NOT found');
  });

  it('should return 400 if trying to update with invalid data (e.g., making a required field null)', async () => {
    const initialPaperData = {
      unitCode: 'CHE101',
      yearTaken: '2023',
      unitTitle: 'Introduction to Chemistry',
      fileLocation: '/path/to/che101.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paper = await Paper.create(initialPaperData);

    const invalidUpdateData = {
      unitTitle: null, // unitTitle is required
    };

    const res = await request(app)
      .put(`/papers/${paper.unitCode}/${paper.yearTaken}`)
      .send(invalidUpdateData);

    // The actual status code might depend on Mongoose validation error handling.
    // It could be 400 or 500 if not handled explicitly as a validation error response.
    // For this example, assuming Mongoose validation errors lead to a 400.
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });
});

describe('DELETE /papers/:unitCode/:yearTaken', () => {
  it('should delete an existing paper', async () => {
    const paperData = {
      unitCode: 'ART202',
      yearTaken: '2024',
      unitTitle: 'Art History',
      fileLocation: '/path/to/art202.pdf',
      classOfStudy: 'Undergraduate',
    };
    const paper = await Paper.create(paperData);

    const res = await request(app)
      .delete(`/papers/${paper.unitCode}/${paper.yearTaken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Paper deleted successfully');

    // Verify data in the database
    const paperInDb = await Paper.findById(paper._id);
    expect(paperInDb).toBeNull();
  });

  it('should return 404 if the paper to delete is not found', async () => {
    const res = await request(app)
      .delete('/papers/NONEXISTENT/2024');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Paper NOT found');
  });
});
