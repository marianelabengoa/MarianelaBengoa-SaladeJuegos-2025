
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

const supabaseUrl = 'https://wznsybxninhseorgkdcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnN5YnhuaW5oc2VvcmdrZGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzQ3MzAsImV4cCI6MjA2MDgxMDczMH0.F_AE4XDTSj0_PCe6Q4wC2LSFPurAc0alW3L00T0XRLQ'; // reemplazar

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getSession() {
    return this.supabase.auth.getSession();
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
  

  // ✅ Obtener usuario actual
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

  async guardarResultadoAhorcado(resultado: any) {
    return await this.supabase
      .from('resultados_ahorcado')
      .insert([resultado]);
  }
  
}

