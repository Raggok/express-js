import 'dotenv/config';
import { Router } from 'express';

import Users from '../domain/users/users.js';

import { tryCatchWrapper } from './utils.js';
import auth from '../middlewares/auth.js';

const router = Router();
const users = new Users();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: id usuario
 *        email:
 *          type: string
 *          description: correo
 *        budget:
 *          type: integer
 *          description: presupuesto
 *        company:
 *          type: string
 *          description: compañia
 *        createAt:
 *          type: string
 *          description: fecha de alta
 *        updateAt:
 *          type: string
 *          description: fecha de actualización
 *        name:
 *          type: string
 *          description: nombre del usuario
 *        status:
 *          type: string
 *          description: estatus
 *        description:
 *          type: string
 *          description: descripción
 *      requiered:
 *        - name
 *        - email
 */

/**
 *  @swagger
 * paths:
 *   /api/users:
 *     get:
 *       summary: Obtener usuario por correo
 *       tags: [User]
 *       parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           description: correo electronico
 *         - in: header
 *           name: x-auth-token
 *           schema:
 *             type: string
 *           description: Token de autenticación
 *       responses:
 *         '200':
 *           description: return user
 *           content:
 *             application/json:
 *               schema:
 *                $ref: '#/components/schemas/User'
 */

router.get(
  '/',
  auth,
  tryCatchWrapper(async (req, res) => {
    const { email } = req.query;

    const user = await users.getByEmail(email);

    res.send(user);
  })
);

/**
 * @swagger
 * /api/users:
 *  post:
 *    summary: Crear un usuario
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              description:
 *                type: string
 *              company:
 *                type: string
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: tokenUser
 */
router.post(
  '/',
  auth,
  tryCatchWrapper(async (req, res) => {
    const { name, email, description, company } = req.body;

    const token = await users.add(name, email, description, company);

    res.send(token);
  })
);

/**
 * @swagger
 * /api/users:
 *  put:
 *    summary: Actualizar un usuario
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              company:
 *                type: string
 *    parameters:
 *      - in: header
 *        name: x-auth-token
 *        schema:
 *          type: string
 *      - in: query
 *        name: email
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Usuario actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 */

router.put(
  '/',
  auth,
  tryCatchWrapper(async (req, res) => {
    const { email } = req.query;
    const { name, description, company } = req.body;

    const token = await users.update(name, email, description, company);

    res.send(token);
  })
);

export default router;
