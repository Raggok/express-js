export default async (req) => {
  const user = req.user;
  const { controller, model, prompt, text, extra } = req.body;

  return 'controller cohere';
};
