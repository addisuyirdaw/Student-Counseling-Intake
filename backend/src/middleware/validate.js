import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.shape && ('body' in schema.shape || 'query' in schema.shape || 'params' in schema.shape)) {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
    } else {
      const dataToValidate = req.method === 'GET' ? req.query : req.body;
      const parsed = schema.parse(dataToValidate);
      if (req.method === 'GET') {
        req.query = parsed;
      } else {
        req.body = parsed;
      }
    }
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};