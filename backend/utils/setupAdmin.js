import User from '../models/User.js';

/**
 * Script para crear el administrador inicial
 * Se ejecuta automáticamente al iniciar el servidor si no existe admin
 */
export const setupInitialAdmin = async () => {
  try {
    // Verificar si ya existe un administrador
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('✅ Administrador ya existe en la base de datos.');
      return;
    }

    // Obtener credenciales del .env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@luminom.ia';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin2026Luminom!';

    // Crear administrador inicial
    const admin = await User.create({
      name: 'Administrador Luminom',
      email: adminEmail,
      password: adminPassword,
      carrera: 'Administrador del Sistema',
      role: 'admin'
    });

    console.log('🎉 ¡Administrador inicial creado exitosamente!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Contraseña:', adminPassword);
    console.log('⚠️  IMPORTANTE: Cambia estas credenciales después del primer login.');

  } catch (error) {
    console.error('❌ Error creando administrador inicial:', error.message);
  }
};
