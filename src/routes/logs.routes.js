import { Router } from 'express';
import Logs from '../domain/logs/logs.js';
import auth from '../middlewares/auth.js';

const logsService = new Logs();

const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    logs:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: id del log
 *        controller:
 *          type: string
 *          description: controlador de la solicitud
 *        cost:
 *          type: number
 *          description: costo aproximado por la solicitud
 *        createAt:
 *          type: string
 *          description: fecha de la solicitud
 *        model:
 *          type: string
 *          description: modelo ocupado para la solicitud
 *        response:
 *          type: string
 *          description: respuesta de la solicitud
 *        text_request:
 *          type: string
 *          description: texto de la solicitud
 *        time:
 *          type: integer
 *          description: tiempo de la solicitud
 *        extra:
 *          type: string
 *          description: datos extras de la solicitud
 *        userId:
 *          type: string
 *          description: id de usuario
 */
/**
 *  @swagger
 * paths:
 *   /api/logs:
 *     get:
 *       summary: Obtener logs por fecha
 *       tags: [Logs]
 *       parameters:
 *         - in: query
 *           name: date
 *           schema:
 *             type: string
 *           description: Fecha en formato YYYY-MM-DD
 *         - in: header
 *           name: x-auth-token
 *           schema:
 *             type: string
 *           description: Token de autenticación
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     controller:
 *                       type: string
 *                     cost:
 *                       type: integer
 *                     creatAt:
 *                       type: string
 *                     extra:
 *                       type: string
 *                     model:
 *                       type: string
 *                     response:
 *                       type: string
 *                     text_request:
 *                       type: string
 *                     time:
 *                       type: integer
 *                     userId:
 *                       type: string
 */
router.get('/', auth, async (req, res) => {
  const { date } = req.query;

  const logs = await logsService.getByDate(date);

  res.send(logs);
});

router.post('/', (req, res) => {
  res.send('POST Logs!');
});

export default router;
