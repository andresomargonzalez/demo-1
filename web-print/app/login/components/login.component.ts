import {Component} from "angular2/core";


@Component({
  selector: "login",
  templateUrl: "app/login/templates/login.template.html",
  styleUrls: ["app/login/css/login.css"]
})

export class Login {
  onSubmit() {
    console.log("LOGIN");
  }
}
