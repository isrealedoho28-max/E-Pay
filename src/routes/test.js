import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Test route is working!' });
  
});

export default router;