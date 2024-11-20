import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResults } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResults<Message[]> | null>(null);

  getMessages(pageMumber: number, pageSize: number, container: string) {
    let params = setPaginationHeaders(pageMumber, pageSize);

    params = params.append('Container', container);

    return this.http.get<Message[]>(this.baseUrl + 'messages', {observe: 'response', params})
    .subscribe({
      next: response => setPaginatedResponse(response, this.paginatedResult)
    })
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username)
  }
  
  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content})
  }

  deleteMessage(id: number) {
    return this.http.delete<Message>(this.baseUrl + 'messages/' + id);
  }
}
