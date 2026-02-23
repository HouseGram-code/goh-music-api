import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface User {
  id: string;
  apiKey: string;
  name: string;
  email: string;
  balance: number;
  totalProcessed: number;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
}

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

export function getUsers(): User[] {
  try {
    ensureDb();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data).users || [];
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

export function saveUsers(users: User[]) {
  try {
    ensureDb();
    fs.writeFileSync(DB_PATH, JSON.stringify({ users }, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

export function createUser(name: string = 'Anonymous', email: string = ''): User {
  const users = getUsers();
  const newUser: User = {
    id: uuidv4(),
    apiKey: `goh_${nanoid(32)}`,
    name,
    email,
    balance: 200000,
    totalProcessed: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function getUserByApiKey(apiKey: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.apiKey === apiKey);
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function deductBalance(userId: string, amount: number): boolean {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return false;
  
  if (users[userIndex].balance < amount) return false;
  
  users[userIndex].balance -= amount;
  users[userIndex].totalProcessed += 1;
  saveUsers(users);
  return true;
}
