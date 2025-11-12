import { Component, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatInputModule } from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar} from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Cliente } from './client';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import { BrasilapiService } from '../brasilapi.service';
import { Municipios, Estados } from '../brasilapi.models';
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    NgxMaskDirective,
    CommonModule
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
  estados: Estados[] = [];
  municipios: Municipios[] = [];

  constructor(
    private service: ClienteService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
      this.route.queryParamMap.subscribe( (query: any) => {
        const params = query['params']
        const id = params['id']
        if(id){
           let clienteEncontrado = this.service.buscarClientePorId(id);
            if(clienteEncontrado){
              this.atualizando = true;
              this.cliente = this.service.buscarClientePorId(id) || Cliente.newCliente();
              if(this.cliente.uf){
                const event = { value: this.cliente.uf}
                this.carregarMunicipios(event as MatSelectChange);
              }
            }

        }
      })

      this.carregarUfs();
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

  carregarUfs(){
    this.brasilApiService.listarUfs().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: erro => console.log("Ocorreu um erro:", erro)
    })
  }

  carregarMunicipios(event: MatSelectChange){
    const ufselecionada = event.value;
    this.brasilApiService.listarMunicipios(ufselecionada).subscribe({
      next: listarMunicipios => this.municipios = listarMunicipios,
      error: erro => console.log("Ocorreu um erro:", erro)
    })
  }
}
