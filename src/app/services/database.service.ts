
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wznsybxninhseorgkdcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnN5YnhuaW5oc2VvcmdrZGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzQ3MzAsImV4cCI6MjA2MDgxMDczMH0.F_AE4XDTSj0_PCe6Q4wC2LSFPurAc0alW3L00T0XRLQ'; // reemplazar

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  async registrar(email: string, password: string, nombre: string, apellido: string, edad: number) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { error };

    // Insertar datos en la tabla usuarios (sin contraseña)
    const insert = await this.supabase
      .from('usuarios')
      .insert([{ email, nombre, apellido, edad }]);

    return insert.error ? { error: insert.error } : { data: insert.data };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  }

  // 🚪 Logout
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      console.log('Sesión cerrada correctamente.');
    }
  }
  

  // ✅ Obtener usuario actual
  async obtenerUsuarioActual() {
    const { data, error } = await this.supabase.auth.getUser();
    return { user: data?.user, error };
  }

  // Método para acceder al cliente directamente si se necesita
  getClient(): SupabaseClient {
    return this.supabase;
  }
  async getUsuarioLogueado() {
    const user = await this.supabase.auth.getUser();
    return user ? user : null;
  }
}

