import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { single } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-labs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  items = signal([
    { id: 1, name: 'Elemento 1' },
    { id: 2, name: 'Elemento 2' },
    { id: 3, name: 'Elemento 3' }
  ]);
  name = "Denis";
  edad = 38;
  disabled = false;
  img = '';

  objPersona = {
    name: "Denis Alvarez",
    edad: 38,
    avatar: ""
  }

  objPersonaConSignal = signal({
    name: " Denis ",
    edad: 38,
    avatar: ""
  })

  colorCntrol = new FormControl();


  funcionClick(){
    alert("Holisssss");
  }

  funcionChange(event: Event){
    console.log(event);
  }

  keydownFuncion(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    const newValor = input.value;
    console.log(input.value);
    //modifico el valor del signal
    this.nombreConSignal.set(newValor);
  }

  //declarar un signal
  nombreConSignal = signal("pp")

//actualizar un campo en un json
  funcionChangeEdad(event: Event) {
    let input = event.target as HTMLInputElement; //leer el valor del input
    let newItem = input.value;//

    // Implementar lógica para agregar nueva tarea en el Array
    this.objPersonaConSignal.update((objPersonaConSignal) => {
      return{
        ...objPersonaConSignal,
        edad: parseInt(newItem, 10)
      }
    });
    }

    //actualizar un campo en un json
  funcionChangeNombre(event: Event) {
    let input = event.target as HTMLInputElement; //leer el valor del input
    let newItem = input.value;//

    // Implementar lógica para agregar nueva tarea en el Array
    this.objPersonaConSignal.update((objPersonaConSignal) => {
      return{
        ...objPersonaConSignal,
        name: newItem
      }
    });
    }
}

