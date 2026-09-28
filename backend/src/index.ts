import api from '@api';
import { environmentService } from '@infrastructure/shared/services/EnvironmentService';

environmentService.load();

const { PORT } = environmentService.get();

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
