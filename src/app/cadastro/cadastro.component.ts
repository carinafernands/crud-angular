import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule } from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Cliente } from './client';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask} from 'ngx-mask';


@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snake: MatSnackBar = inject(MatSnackBar);

  constructor(
    private service: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ){

  }

  ngOnInit(): void {
      this.route.queryParamMap.subscribe( (query: any) => {
        const params = query['params']
        const id = params['id']
        if(id){
           let clienteEncontrado = this.service.buscarClientePorId(id);
            if(clienteEncontrado){
              this.atualizando = true;
              this.cliente = this.service.buscarClientePorId(id) || Cliente.newCliente();
            }

        }
      })
  }

  salvar(){

    if(!this.atualizando){

      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem("Salvo com sucesso!")
    } else {
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta']);
      this.mostrarMensagem("Atualizado com sucesso!")

    }
  }

  mostrarMensagem(mensagem: string){
    this.snake.open(mensagem, "Ok")
  }

}
