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
    this.leerArticulosServidor();
  }

  // Carga las noticias desde el servidor REST
  private leerArticulosServidor() {
    // Definimos la categoria que queremos
    let busqueda: string = this.getCategory("general");
    // Declaramos el observable y lo inicializamos con una consulta GET al servidor REST
    let observableRest: Observable<RespuestaNoticias> = this.restServer.get<RespuestaNoticias>(busqueda);

     // Nos suscribimos al observable y gestionamos los datos recibidos
     observableRest.subscribe((resp) => {
      this.listaNoticias.push(...resp.articles);
    });
  }

  // Devuelve la busqueda REST con la categoría a buscar
  public getCategory(categoria: string): string {
    let cadena: string = "https://newsapi.org/v2/top-headlines?country=us&category=" + categoria + "&apiKey=e4a36b71b78444d28aacbf5879dd7b4b"
    return cadena;
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
