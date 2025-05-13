import {
  Component,
  inject,
  signal,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  standalone: true,
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  supabaseService = inject(DatabaseService);
  mensajes = signal<any>([]);
  mensaje = '';
  usuarioLogueadoEmail: string = '';
  canal: any;

  constructor() {
    this.supabaseService.TraerMensajes().then((data) => {
      this.mensajes.set([...data]);
    });
  }

  ngAfterViewChecked(): void {
    if (this.chatContainer && this.mensajes().length) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('No se pudo hacer scroll al fondo del chat:', err);
    }
  }

  ngOnInit() {
    this.supabaseService.obtenerUsuarioActual().then((res) => {
      this.usuarioLogueadoEmail = res.user?.email || '';
    });

    this.canal = this.supabaseService.supabase.channel('table-db-changes');
    this.canal.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensajes',
      },
      async (cambios: any) => {
        const { data } = await this.supabaseService.supabase
          .from('usuarios')
          .select('nombre, correo')
          .eq('id', cambios.new['id_usuario'])
          .single();

        cambios.new.usuarios = {
          nombre: data?.nombre,
          correo: data?.correo,
        };

        this.mensajes.update((valor_anterior) => {
          valor_anterior.push(cambios.new);
          return valor_anterior;
        });
      }
    );
    this.canal.subscribe();
  }

  ngOnDestroy() {
    this.canal.unsubscribe();
  }

  enviar() {
    if (this.mensaje.trim()) {
      this.supabaseService.GuardarMensajes(this.mensaje.trim());
      this.mensaje = '';
    }
  }

  formatearRelativo(fechaString: string): string {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const segundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

    if (segundos < 60) {
      return 'hace unos segundos';
    } else if (segundos < 3600) {
      const minutos = Math.floor(segundos / 60);
      return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else if (segundos < 86400) {
      const horas = Math.floor(segundos / 3600);
      return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (segundos < 172800) {
      return 'ayer';
    } else {
      const dias = Math.floor(segundos / 86400);
      return `hace ${dias} día${dias > 1 ? 's' : ''}`;
    }
  }
}
