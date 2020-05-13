import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChatService } from './chat.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public users: any[] = [];
  public username: string = null;
  public avatar = 'Avatar';
  public text = '';
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  public chats: any[] = [];

  constructor(private chatService: ChatService,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getUsers();
    this.getChats();
  }

  ngAfterViewInit(){
    interval(2000).subscribe(() => this.getChats(), this.getUsers);
}

  submit() {
    this.chatService.insertUser(this.username).subscribe((data: any) => {
      this.users = Object.keys(data.data).map(key => ({id: key, value: data.data[key]}));
      this.snackBar.open('Create ' +  this.username + ' success!', 'Done', {
        duration: 2000,
      });
      this.username = null;
    });
  }

  getUsers() {
    this.chatService.getUsers().subscribe((data: any) => {
      this.users = Object.keys(data.data).map(key => ({id: key, value: data.data[key]}));
    });
  }

  getChats() {
    this.chatService.getChats().subscribe((data: any) => {
      // this.chats = Object.keys(data.data).map(key => ({id: key, value: data.data[key]}));
      if (data.data) {
        this.chats = Object.keys(data.data).map(key => ({id: key, value: data.data[key]}));
      }
    });
  }

  onClickSend() {
    this.chatService.insertMessage(this.avatar ?? 'Avatar', this.text).subscribe((data: any) => {
      if (data.result) {
        this.text = null;
        this.getChats();
      }
    });
  }

  onClickTab($event) {
    if ($event.index === 2) {
      this.getChats();
    }
  }

  selectUser(name: string) {
    this.snackBar.open('Selected ' +  name + ' success!', 'Done', {
      duration: 2000,
    });
    this.avatar = name;
  }
}
