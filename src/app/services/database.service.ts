
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

const supabaseUrl = 'https://wznsybxninhseorgkdcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnN5YnhuaW5oc2VvcmdrZGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzQ3MzAsImV4cCI6MjA2MDgxMDczMH0.F_AE4XDTSj0_PCe6Q4wC2LSFPurAc0alW3L00T0XRLQ'; // reemplazar

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

  // Método para guardar los resultados en la base de datos
  async guardarEstadisticas(usuario: string, aciertos: number, errores: number) {
    const { data, error } = await this.supabase
      .from('ahorcado')
      .insert([
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
    const { data, error } = await this.supabase
      .from('secuencia')
      .insert([
        {
          usuario: usuario,
          nivel: nivel
        },
      ]);

    if (error) {
      console.error('Error al guardar las estadísticas:', error.message);
      return { error };
    }
    
    console.log('Estadísticas guardadas:', data);
    return { data };
  }

  async registrar(email: string, password: string, nombre: string, apellido: string, edad: number) {
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
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert([
        {
          nombre: nombre,
          correo: correo
        },
      ]);

    if (error) {
      console.error('Error al guardar:', error.message);
      return { error };
    }
    
    console.log("Guardado:", data);
    return { data };
  }
  
  async guardarMayorMenor(usuario: string, aciertos: number, tiempo: number) {
    const fecha = new Date().toISOString(); // formato estándar
  
    const { data, error } = await this.supabase
      .from('mayor_menor')
      .insert([
        {
          usuario,
          aciertos,
          tiempo,
          fecha,
        },
      ]);
  
    if (error) {
      console.error('Error al guardar la partida de Mayor o Menor:', error.message);
      return { error };
    }
  
    console.log('Partida guardada en mayor_menor:', data);
    return { data };
  }
  
  async TraerMensajes(){
    const {data} = await this.supabase.from("mensajes").select("id,mensaje, created_at, usuarios (id,nombre,correo)");
    return data as any[];
  }

  async GuardarMensajes(mensaje: string) {
    const { data: userData, error: authError } = await this.supabase.auth.getUser();
  
    if (authError || !userData.user) {
      console.error("No se pudo obtener el usuario logueado");
      return;
    }
  
    const email = userData.user.email;
  
    const { data: usuarioData, error: userError } = await this.supabase
      .from("usuarios")
      .select("id")
      .eq("correo", email)
      .single();
  
    if (userError || !usuarioData) {
      console.error("Usuario no encontrado en tabla usuarios");
      return;
    }
  
    const id_usuario = usuarioData.id;
  
    const { data, error } = await this.supabase.from("mensajes").insert({
      mensaje: mensaje,
      id_usuario: id_usuario,
    });
  
    if (error) {
      console.error("Error al guardar mensaje:", error.message);
    }
  }
  
  
}

