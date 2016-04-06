///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap}    from "angular2/platform/browser";
import {HTTP_PROVIDERS} from "angular2/http";
import {ROUTER_PROVIDERS} from "angular2/router";
import "rxjs/Rx";
import {provide} from 'angular2/core';
import {LocationStrategy, HashLocationStrategy } from 'angular2/router';

import {MainComponent} from "./main/components/main.component";

bootstrap(MainComponent, [HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
