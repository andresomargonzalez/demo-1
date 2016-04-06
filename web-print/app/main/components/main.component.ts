import { RouteConfig,  ROUTER_DIRECTIVES } from "angular2/router";
import {Component} from "angular2/core";
import {Login} from "../../login/components/login.component";
import {Dashboard} from "../../dashboard/components/dashboard.component";

@Component({
  selector: "ag2-print",
  templateUrl: "app/main/templates/main.template.html",
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: "/login", component: Login, name: "Login", useAsDefault: true},
  {path: "/dashboard", component: Dashboard, name: "Dashboard"}
])
export class MainComponent {
}
