import { GestionNoticiasLeerService } from './../../services/gestion-noticias-leer.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RespuestaNoticias, Article } from './../../interfaces/interfaces';
import { GestionStorageService } from 'src/app/services/gestion-storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // Declaramos y creamos el array de noticias vacío
  listaNoticias: Article[] = [];

  // Añadimos HttpClient y el servicio en el constructor
  constructor(private restServer: HttpClient, public gestionNoticiasLeerService: GestionNoticiasLeerService, private gestionAlmacen: GestionStorageService) {
    this.cargarNoticias();
  }

  // Método para cargar las noticias
  private async cargarNoticias() {
    // Intentamos cargar las noticias desde el almacenamiento local
    const noticiasGuardadas = await this.gestionAlmacen.getObject("articulos");

    if (noticiasGuardadas && noticiasGuardadas.length > 0) {
      // Si existen noticias almacenadas, las asignamos a listaNoticias
      this.listaNoticias = noticiasGuardadas;
    } else {
      // Si no hay noticias almacenadas, cargamos todas las noticias desde el servidor
      this.leerArticulosServidor();
    }
  }

  // Carga las noticias desde el servidor REST
  private leerArticulosServidor() {
    // Declaramos el observable y lo inicializamos con una consulta GET al servidor REST
    let observableRest: Observable<RespuestaNoticias> = this.restServer.get<RespuestaNoticias>("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=e4a36b71b78444d28aacbf5879dd7b4b");

     // Nos suscribimos al observable y gestionamos los datos recibidos
     observableRest.subscribe((resp) => {
      console.log("Noticias recibidas del servidor:", resp);
      this.listaNoticias.push(...resp.articles);
    });
  }
  
  // Comprueba si la noticia seleccionada (checked) está para leer o no
  seleccionado(item: Article): boolean {
    let indice: number = this.gestionNoticiasLeerService.buscarNoticia(item);
    if (indice != -1) {
      return true;
    }
    return false; 
  }

  // Cuando cambia el check, en función de su valor añade o borra la noticia del array
  checkNoticia(eventoRecibido: any, item: Article) {
    let estado: boolean = eventoRecibido.detail.checked;
    if (estado) {
      this.gestionNoticiasLeerService.addNoticias(item);
    } else {
      this.gestionNoticiasLeerService.borrarNoticia(item);
    }    
  }
}
