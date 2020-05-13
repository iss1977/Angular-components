import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {Component, NgModule, Input, EventEmitter,Output}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';


/* class Joke holds data and methods for a Joke.
 */

class Joke {
  public setup: string;
  public punchline: string;
  public hide: boolean;
  public idJoke:number;

  constructor(setup: string, punchline: string) {
    this.setup = setup;
    this.punchline = punchline;
    this.hide = true;
    this.idJoke = this.getRandomInt(20,30);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  toggle() {
    this.hide = !this.hide;
  }
}

/* Joke Component : holds a form to add a joke to the list. @Output : Eventemitter mit joke:Joke  */

@Component({
  selector:'joke-form',
  template:`
  <div class="card card-block">
    <h4 class="card-title">Card Title</h4>
    <div class="form-group">
      <input type="text" class="form-coltrol" placeholder="Enter the setup" #setup>
    </div>
    <div class="form-group">
      <input type="text" class="form-coltrol" placeholder="Enter the punchline" #punchline>
    </div>
    <button type="button" class="btn btn-primary" (click)="createJoke(setup.value, punchline.value)">Create</button>

  </div>
  `
})
class JokeFormComponent{
  @Output() jokeCreated = new EventEmitter <Joke>();

  createJoke(setup:string, punchline:string){
    this.jokeCreated.emit(new Joke(setup,punchline))
  }
}



@Component({
  selector:'joke',
  template: `
  <div class="card card-block">
    <h4 class="card-title">
      <ng-content select=".setup"></ng-content>
    </h4>
    <p>{{data.idJoke}}</p>
    <p class="card-text" [hidden]="data.hide">
         <ng-content  select=".punchline"></ng-content>
      </p>
    <a class="btn btn-warning" (click)="data.toggle()">Tell Me</a>
  </div>
    `
})
class JokeComponent{
  @Input ('joke') data: Joke;
  
}


@Component({
  selector: 'joke-list',
  template: `
  <!-- Joke form emits an event via @Output - Eventemitter. Emits an event with with a ref to a variable type "Joke"-->
  <joke-form (jokeCreated)="addJoke($event)"></joke-form>

  <!-- This component uses content projection-->

  <joke *ngFor="let j of jokes" [joke]="j">
      <h1 class = "setup">{{j.setup}}</h1>  
      <p class="punchline">{{j.punchline}}<p>
  </joke>
  `
})
class JokeListComponent {
  jokes: Joke[];

  constructor() {
    this.jokes = [
      new Joke("What did the cheese say when it looked in the mirror?", "Hello-me (Halloumi)"),
      new Joke("What kind of cheese do you use to disguise a small horse?", "Mask-a-pony (Mascarpone)"),
      new Joke("A kid threw a lump of cheddar at me", "I thought ‘That’s not very mature’"),
    ];
  }

  addJoke(joke:Joke){
    this.jokes.unshift(joke);
  }
}

@Component({
  selector:'app',
  template:`
  <joke-list></joke-list>
  `
})
class AppComponent{

}


@NgModule({
  imports: [BrowserModule],
  declarations: [JokeComponent, JokeListComponent, AppComponent, JokeFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);