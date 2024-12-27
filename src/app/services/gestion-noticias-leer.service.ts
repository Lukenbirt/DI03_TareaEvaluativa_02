import { Injectable } from '@angular/core';
import { Article } from '../interfaces/interfaces';
import { GestionStorageService } from './gestion-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GestionNoticiasLeerService {

  private leerNoticias : Article[] = [];

  constructor(public gestionAlmacen: GestionStorageService) { 
    this.cargarNoticiasAlmacenadas();
  }

  // Carga los datos almacenados de forma persistente. Si no existen datos almacenados inicializa el array vacío
  private async cargarNoticiasAlmacenadas() {
    const noticiasAlmacenadas = await this.gestionAlmacen.getObject("articulos");
    this.leerNoticias = noticiasAlmacenadas || [];
  }

  // Devuelve todas las noticias para leer
  getNoticias() {
    return this.leerNoticias;
  }

  //Añade una nueva noticia al array para poder leer y lo almacena
  addNoticias(noticia : Article){
    let noticiaString = JSON.stringify(noticia);
    noticia = JSON.parse(noticiaString);

    this.leerNoticias.push(noticia);
    this.gestionAlmacen.setObject("articulos",this.leerNoticias);
  }

  /* Comprueba si una noticia ya está en el array.
   * Mediante find vamos recorriendo todo el array hasta encontrar un objeto noticia que coincida con el objeto item que viene desde tab1.page.ts -> seleccionado()
   */
  buscarNoticia(item: Article): number  {
    let articuloEncontrado: any = this.leerNoticias.find(
      function(noticia) { 
        return JSON.stringify(noticia) == JSON.stringify(item);
      }
    );
    let indice = this.leerNoticias.indexOf(articuloEncontrado);
    return indice;
  }

  // Borra una noticia del array y lo almacena
  borrarNoticia(item: Article) {
    let indice = this.buscarNoticia(item);
    if (indice != -1) {
      this.leerNoticias.splice(indice, 1);
      this.gestionAlmacen.setObject("articulos",this.leerNoticias);
    }
  }

}
