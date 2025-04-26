import { Component, computed, signal, effect, inject, InjectionToken, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tareas } from '../../models/tareas.models'; //importando una interfaz
import { FormControl, ReactiveFormsModule, Validators, ValidatorFn  } from '@angular/forms';



@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items = signal([
     'Angular 17',
     'Flutter',
     'Git',
     'Nunca parar de aprender'
  ]);


 tareasConControl = new FormControl('', {
  nonNullable: true,
  //notOnlyWhitespace(),
  validators: [
    Validators.required, //que el valor sea requerido
    Validators.nullValidator,
    Validators.pattern('^\\S.*$'), //se valida que al presionar enter no guarde vacios
    Validators.minLength(3),

  ]
 });

 /*notOnlyWhitespace(): ValidatorFn {
  return (tareasConControl: FormControl): { [key: string]: any } | null => {
    const isWhitespace = (tareasConControl.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'notOnlyWhitespace': true };
  };
}*/

  //se deja vacio el objeto y se va a obtener de la memoriade localStorage
  objetoItems = signal<tareas[]>([]);


  changeValorConControl() {
    if(this.tareasConControl.valid){
      const value = this.tareasConControl.value; //obtengo el valor de la caja de texto
      this.addTareas(value);
      this.tareasConControl.setValue('');//limpiar el input
    }

}


  changeHandler(event: Event) {
    let input = event.target as HTMLInputElement; //leer el valor del input
    let newItem = input.value;//

    // Implementar lógica para agregar nueva tarea en el Array
    this.items.update((items) => [...items, newItem]);
    input.value = ''; //para limpiar la caja despues de agg el valor a la lista
    this.addTareas(newItem);
    this.tareasConControl.setValue('');//limpiar el input
}

deleteItems(index: number) {
  this.items.set(
       this.items()
       .filter((_, position) =>  position != index));
}



//forma de actualizar un valor en un objeto
addTareas(title: string){
  const newTarea = {
      id: 3,
      title,
      estado: false
  }
  this.objetoItems.update((objetoItems) => [...objetoItems, newTarea]);
}

//actualiza una posicion en especifico --
updateTarea(index: number){
  this.objetoItems.update((objetoItems) => {
    return objetoItems.map((objetoItems, position) => {
      if(position === index){
        return{
          ...objetoItems,
          estado: !objetoItems.estado
        }
      }
      return objetoItems;
    })
  })
}

//actualiza una tarea por posicion segun el estado en especifico --
updateTareaEditingMode(index: number){
  if(this.objetoItems()[index].estado === true) return; ///para que no permita editar una tarea que este cmpletada

  this.objetoItems.update((objetoItems) => {
    return objetoItems.map((objetoItems, position) => {
      if(position === index){
        return{
          ...objetoItems,
          editing: true
        }
      }
      return{
        ...objetoItems,
        editing: false
      }
    })
  })
}

//actualiza el texto del inputt
updateTareaEditandoElTexto(index: number, event: Event){
  let input = event.target as HTMLInputElement; //leer el valor del input
  this.objetoItems.update((objetoItems) => {
    return objetoItems.map((objetoItems, position) => {
      if(position === index){
        return{
          ...objetoItems,
          title: input.value,
          editing: false

        }
      }
      return objetoItems
    })
  })
}

//elimina una tarea de una posicion en especifico
deleteTarea(index: number){
  this.objetoItems.set(
    this.objetoItems()
    .filter((_, position) =>  position != index));
}

filter = signal<'all' | 'pending' | 'completed'>('all'); //Para filtrar todas las tareas

changeFilter(filter: 'all' | 'pending' | 'completed'){
  this.filter.set(filter);
}

//para filtar las tareas segun su estado usando computed
tareasConFiltro = computed(() => {
  const filter = this.filter();
  const objetoItems = this.objetoItems();
  //para listar las tareas segun el estado
  if( filter === "pending" ){
    return objetoItems.filter( objetoItems => !objetoItems.estado )
  }
  if( filter === "completed" ){
    return objetoItems.filter( objetoItems => objetoItems.estado )
  }
  return objetoItems;
})


/*constructor(){
  effect(() => {
    const objetoItems = this.objetoItems();
    console.log("Aquii: " + JSON.stringify(objetoItems));
    //localStorage.setItem('tasks', JSON.stringify(this.objetoItems()));
    localStorage.setItem('objetoItems', JSON.stringify(this.objetoItems));
  })
}*/

/*ngOnInit() {
  const storage = localStorage.getItem('objetoItems');

  if (storage){
    const objetoItems: tareas[] = JSON.parse(storage);
    this.objetoItems.set(objetoItems);
    console.log("storage: " +storage);
  }

 }*/

 ngOnInit() {
  const storageTasks = localStorage.getItem('objetoItems');
  if(storageTasks) {
     const objetoItems: tareas[] = JSON.parse(storageTasks);
     this.objetoItems.set(objetoItems);
  }
  //llamar al metodo que contiene el effect
  this.tackTareas();
 }

 //si se necesita agregar effect en otro lado que no sea el constructor,
 //se debe agregar una inyeccion.
 constructor() {
   effect(() => {
     localStorage.setItem('objetoItems', JSON.stringify(this.objetoItems()));
   });
 }

 //agg inyeccion
 injector = inject(Injector);

 tackTareas(){
  effect(() => {
    const objetoItems = this.objetoItems();
    localStorage.setItem('objetoItems', JSON.stringify(this.objetoItems()));
  }, { injector: this.injector });
 }


}
