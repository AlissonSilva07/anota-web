import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  imports: [RouterOutlet, SharedModule, SidebarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
