import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

const supabaseUrl = 'https://wznsybxninhseorgkdcc.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnN5YnhuaW5oc2VvcmdrZGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzQ3MzAsImV4cCI6MjA2MDgxMDczMH0.F_AE4XDTSj0_PCe6Q4wC2LSFPurAc0alW3L00T0XRLQ'; // reemplazar

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  async guardarEstadisticas(
    usuario: string,
    aciertos: number,
    errores: number
  ) {
    const { data, error } = await this.supabase.from('ahorcado').insert([
      {
        usuario: usuario,
        aciertos: aciertos,
        errores: errores,
      },
    ]);

    if (error) {
      console.error('Error al guardar las estadísticas:', error.message);
      return { error };
    }

    console.log('Estadísticas guardadas:', data);
    return { data };
  }

  async guardarSecuencia(usuario: string, nivel: number) {
    const { data, error } = await this.supabase.from('secuencia').insert([
      {
        usuario: usuario,
        nivel: nivel,
      },
    ]);

    if (error) {
      console.error('Error al guardar las estadísticas:', error.message);
      return { error };
    }

    console.log('Estadísticas guardadas:', data);
    return { data };
  }

  async registrar(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    edad: number
  ) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
          edad,
        },
      },
    });

    if (error) {
      console.error('Error en registrar del servicio:', error.message);
    }

    return { data, error };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      console.log('Sesión cerrada correctamente.');
      this.router.navigate(['/login']);
    }
  }

  async obtenerUsuarioActual() {
    const { data, error } = await this.supabase.auth.getUser();
    return { user: data?.user, error };
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  async getUsuarioLogueado() {
    const user = await this.supabase.auth.getUser();
    return user ? user : null;
  }

  async guardarNombreCorreo(nombre: string, correo: string) {
    const { data, error } = await this.supabase.from('usuarios').insert([
      {
        nombre: nombre,
        correo: correo,
      },
    ]);

    if (error) {
      console.error('Error al guardar:', error.message);
      return { error };
    }

    console.log('Guardado:', data);
    return { data };
  }

  async guardarMayorMenor(usuario: string, aciertos: number, tiempo: number) {
    const fecha = new Date().toISOString(); // formato estándar

    const { data, error } = await this.supabase.from('mayor_menor').insert([
      {
        usuario,
        aciertos,
        tiempo,
        fecha,
      },
    ]);

    if (error) {
      console.error(
        'Error al guardar la partida de Mayor o Menor:',
        error.message
      );
      return { error };
    }

    console.log('Partida guardada en mayor_menor:', data);
    return { data };
  }

  async TraerMensajes() {
    const { data } = await this.supabase
      .from('mensajes')
      .select('id,mensaje, created_at, usuarios (id,nombre,correo)');
    return data as any[];
  }

  async GuardarMensajes(mensaje: string) {
    const { data: userData, error: authError } =
      await this.supabase.auth.getUser();

    if (authError || !userData.user) {
      console.error('No se pudo obtener el usuario logueado');
      return;
    }

    const email = userData.user.email;

    const { data: usuarioData, error: userError } = await this.supabase
      .from('usuarios')
      .select('id')
      .eq('correo', email)
      .single();

    if (userError || !usuarioData) {
      console.error('Usuario no encontrado en tabla usuarios');
      return;
    }

    const id_usuario = usuarioData.id;

    const { data, error } = await this.supabase.from('mensajes').insert({
      mensaje: mensaje,
      id_usuario: id_usuario,
    });

    if (error) {
      console.error('Error al guardar mensaje:', error.message);
    }
  }

  async obtenerNombreDelUsuarioActual(): Promise<string | null> {
    const { data: authData, error: authError } =
      await this.supabase.auth.getUser();

    if (authError || !authData.user) {
      console.error('No se pudo obtener el usuario autenticado');
      return null;
    }

    const email = authData.user.email;

    const { data: usuarioData, error: userError } = await this.supabase
      .from('usuarios')
      .select('nombre')
      .eq('correo', email)
      .single();

    if (userError || !usuarioData) {
      console.error("No se encontró el usuario en la tabla 'usuarios'");
      return null;
    }

    return usuarioData.nombre;
  }

  async obtenerNombrePorCorreo(correo: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('nombre')
      .eq('correo', correo)
      .single();

    if (error || !data) {
      console.error('Error al obtener nombre por correo:', error?.message);
      return null;
    }

    return data.nombre;
  }

  async guardarPreguntados(usuario: string, aciertos: number, errores: number) {
    const fecha = new Date().toISOString();

    const { data, error } = await this.supabase.from('preguntados').insert([
      {
        usuario,
        aciertos,
        errores,
        fecha,
      },
    ]);

    if (error) {
      console.error('Error al guardar en preguntados:', error.message);
      return { error };
    }

    console.log('Estadística de preguntados guardada:', data);
    return { data };
  }
  async actualizarPreguntados(usuario: string, esAcierto: boolean) {
    const { data: existente, error: errorSelect } = await this.supabase
      .from('preguntados')
      .select('id, aciertos, errores')
      .eq('usuario', usuario)
      .eq('finalizada', false)
      .single();

    if (errorSelect && errorSelect.code !== 'PGRST116') {
      console.error(
        'Error al buscar el registro de preguntados:',
        errorSelect.message
      );
      return { error: errorSelect };
    }

    if (!existente) {
      const { error: errorInsert } = await this.supabase
        .from('preguntados')
        .insert([
          {
            usuario,
            aciertos: esAcierto ? 1 : 0,
            errores: esAcierto ? 0 : 1,
            fecha: new Date().toISOString(),
          },
        ]);

      if (errorInsert) {
        console.error(
          'Error al insertar nuevo registro en preguntados:',
          errorInsert.message
        );
        return { error: errorInsert };
      }
    } else {
      const nuevosAciertos = existente.aciertos + (esAcierto ? 1 : 0);
      const nuevosErrores = existente.errores + (esAcierto ? 0 : 1);

      const { error: errorUpdate } = await this.supabase
        .from('preguntados')
        .update({
          aciertos: nuevosAciertos,
          errores: nuevosErrores,
          fecha: new Date().toISOString(),
        })
        .eq('id', existente.id);

      if (errorUpdate) {
        console.error('Error al actualizar preguntados:', errorUpdate.message);
        return { error: errorUpdate };
      }
    }

    return { success: true };
  }
  async finalizarPartidaPreguntados(usuario: string) {
    const { data: partida, error } = await this.supabase
      .from('preguntados')
      .select('id')
      .eq('usuario', usuario)
      .eq('finalizada', false)
      .single();

    if (error || !partida) {
      console.error(
        'No se encontró partida activa para finalizar:',
        error?.message
      );
      return;
    }

    const { error: updateError } = await this.supabase
      .from('preguntados')
      .update({ finalizada: true })
      .eq('id', partida.id);

    if (updateError) {
      console.error('Error al finalizar partida:', updateError.message);
    }
  }
  async iniciarNuevaPartidaPreguntados(usuario: string) {
    const { data: activa, error } = await this.supabase
      .from('preguntados')
      .select('id')
      .eq('usuario', usuario)
      .eq('finalizada', false)
      .single();

    if (!activa) {
      const { error: insertError } = await this.supabase
        .from('preguntados')
        .insert([
          {
            usuario,
            aciertos: 0,
            errores: 0,
            fecha: new Date().toISOString(),
            finalizada: false,
          },
        ]);

      if (insertError) {
        console.error('Error al iniciar nueva partida:', insertError.message);
      }
    }
  }
}
