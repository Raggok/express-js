import { Router } from 'express';

import auth from '../middlewares/auth.js';
import { tryCatchWrapper } from './utils.js';
import { validFilePath } from '../utils/api-utils.js';

const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Controller:
 *      type: object
 *      properties:
 *        controller:
 *          type: string
 *          description: controlador
 *        extra:
 *          type: string
 *          description: extras de la solicitud
 */

/**
 *  @swagger
 * paths:
 *   /api:
 *     post:
 *       summary: Ejecuta un controlador dinámico
 *       tags: [Controller]
 *       parameters:
 *         - in: header
 *           name: x-auth-token
 *           schema:
 *             type: string
 *           description: Token de autenticación
 *       requestBody:
 *         required: true
 *         description: Ingresa los parametros necesarios para el controlador a ocupar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Controller'
 *       responses:
 *         '200':
 *           description: Respuesta exitosa
 */

/**
 * /:
 *   post:
 *     summary: Ejecuta un controlador dinámico
 *     description: Ejecuta un controlador dinámico basado en la ruta proporcionada.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               controller:
 *                 type: string
 *                 description: Ruta al controlador (sin la extensión .js)
 *             example:
 *               controller: "nombre_del_controlador"
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   description: Resultado de la ejecución del controlador
 **/
router.post(
  '/',
  auth,
  tryCatchWrapper(async (req, res) => {
    if (validFilePath(req.body.controller)) {
      const module = '../controllers/' + req.body.controller + '.js';
      import(module).then(async (model) => {
        try {
          const result = await model.default(req);

          res.send(result);
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
      });
    } else {
      res.status(400).send('Invalid model');
    }
  })
);

export default router;
