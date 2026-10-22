import { Router } from 'express';
import { registerUserController } from '../controllers/register-user-controller';
import { loginUserController } from '../controllers/login-user-controller';
import { checkAvailabilityController } from '../controllers/check-availability-controller';
import { authenticationMiddleware } from '../middlewares/authentication-middleware';
import { getCurrentUserController } from '../controllers/get-current-user-controller';
import { updateUserController } from '../controllers/update-user-controller';
import { deleteUserController } from '../controllers/delete-user-controller';
import { getPublicProfileController } from '../controllers/get-public-profile-controller';
import { forgotPasswordController } from '../controllers/forgot-password-controller';
import { resetPasswordController } from '../controllers/reset-password-controller';
import { loginRateLimiter } from '../middlewares/auth-rate-limiters-middleware';

export const userRouter = Router();
// REGISTRAR USUARIO
userRouter.post('/register', registerUserController);

// INICIAR SESIÓN
userRouter.post('/login', loginRateLimiter, loginUserController);

// CONSULTAR DISPONIBILIDAD DE USUARIO/EMAIL
userRouter.get('/availability', checkAvailabilityController);

// CONSULTAR PERFIL
userRouter.get('/me', [authenticationMiddleware, getCurrentUserController]);

// MODIFICAR PERFIL
userRouter.patch('/me', [authenticationMiddleware, updateUserController]);

// ELIMINAR CUENTA
userRouter.delete('/me', [authenticationMiddleware, deleteUserController]);

// CONSULTAR PERFIL PÚBLICO DE OTRO USUARIO
userRouter.get('/profile/:username', getPublicProfileController);

// SOLICITAR CORREO RECUPERACIÓN
userRouter.post('/forgot-password', forgotPasswordController);

// CAMBIAR CONTRASEÑA
userRouter.post('/reset-password', resetPasswordController);
