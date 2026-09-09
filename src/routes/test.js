import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('Test route accessed');
  res.status(200).json({ message: 'Test route is working!' });
  
});

export default router;