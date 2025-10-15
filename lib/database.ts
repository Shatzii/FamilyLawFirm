// Local SQLite Database for Colorado Family Law Platform
// Secure offline development environment

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export interface Case {
  id?: number;
  case_number: string;
  client_name: string;
  case_type: 'dissolution' | 'legal_separation' | 'paternity' | 'modification' | 'contempt';
  county: 'denver' | 'arapahoe' | 'jefferson' | 'boulder' | 'other';
  status: 'intake' | 'active' | 'pending' | 'closed';
  attorney_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Document {
  id?: number;
  case_id: number;
  name: string;
  type: 'petition' | 'response' | 'motion' | 'order' | 'agreement' | 'financial' | 'other';
  jdf_form?: string;
  content?: string;
  file_path?: string;
  created_at?: string;
}

export interface Calculation {
  id?: number;
  case_id: number;
  type: 'child_support' | 'parenting_time' | 'asset_division' | 'maintenance';
  inputs: string; // JSON string
  results: string; // JSON string
  colorado_compliant: boolean;
  created_at?: string;
}

export interface Client {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  confidential: boolean;
  created_at?: string;
}

let db: any = null;

export async function openDb() {
  if (db) return db;
  
  const dbPath = path.join(process.cwd(), 'bam-familex.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  return db;
}

export async function initDatabase() {
  const database = await openDb();
  
  // Enable foreign key constraints
  await database.exec('PRAGMA foreign_keys = ON;');
  
  // Create cases table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_number TEXT UNIQUE NOT NULL,
      client_name TEXT NOT NULL,
      case_type TEXT NOT NULL CHECK(case_type IN ('dissolution', 'legal_separation', 'paternity', 'modification', 'contempt')),
      county TEXT NOT NULL CHECK(county IN ('denver', 'arapahoe', 'jefferson', 'boulder', 'other')),
      status TEXT NOT NULL CHECK(status IN ('intake', 'active', 'pending', 'closed')),
      attorney_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Create clients table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      date_of_birth DATE,
      confidential BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Create documents table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('petition', 'response', 'motion', 'order', 'agreement', 'financial', 'other')),
      jdf_form TEXT,
      content TEXT,
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases (id) ON DELETE CASCADE
    );
  `);
  
  // Create calculations table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS calculations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('child_support', 'parenting_time', 'asset_division', 'maintenance')),
      inputs TEXT NOT NULL,
      results TEXT NOT NULL,
      colorado_compliant BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases (id) ON DELETE CASCADE
    );
  `);
  
  // Create calendar/deadlines table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS deadlines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      due_date DATE NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases (id) ON DELETE CASCADE
    );
  `);
  
  // Create communication log
  await database.exec(`
    CREATE TABLE IF NOT EXISTS communications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('email', 'phone', 'meeting', 'court', 'other')) NOT NULL,
      subject TEXT,
      content TEXT,
      participants TEXT,
      date_time DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases (id) ON DELETE CASCADE
    );
  `);
  
  // Create indexes for better performance
  await database.exec(`
    CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
    CREATE INDEX IF NOT EXISTS idx_cases_county ON cases(county);
    CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id);
    CREATE INDEX IF NOT EXISTS idx_calculations_case ON calculations(case_id);
    CREATE INDEX IF NOT EXISTS idx_deadlines_due_date ON deadlines(due_date);
  `);
  
  console.log('✅ BAM FamiLex database initialized successfully');
  return database;
}

// Database operations for cases
export class CaseService {
  static async create(caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const db = await openDb();
    const result = await db.run(
      `INSERT INTO cases (case_number, client_name, case_type, county, status, attorney_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [caseData.case_number, caseData.client_name, caseData.case_type, caseData.county, caseData.status, caseData.attorney_id]
    );
    return result.lastID;
  }
  
  static async findAll(): Promise<Case[]> {
    const db = await openDb();
    return db.all('SELECT * FROM cases ORDER BY created_at DESC');
  }
  
  static async findById(id: number): Promise<Case | null> {
    const db = await openDb();
    return db.get('SELECT * FROM cases WHERE id = ?', [id]);
  }
  
  static async update(id: number, updates: Partial<Case>): Promise<boolean> {
    const db = await openDb();
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    const result = await db.run(
      `UPDATE cases SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    return result.changes > 0;
  }
}

// Database operations for calculations
export class CalculationService {
  static async save(calcData: Omit<Calculation, 'id' | 'created_at'>): Promise<number> {
    const db = await openDb();
    const result = await db.run(
      `INSERT INTO calculations (case_id, type, inputs, results, colorado_compliant) 
       VALUES (?, ?, ?, ?, ?)`,
      [calcData.case_id, calcData.type, calcData.inputs, calcData.results, calcData.colorado_compliant]
    );
    return result.lastID;
  }
  
  static async findByCase(caseId: number): Promise<Calculation[]> {
    const db = await openDb();
    return db.all('SELECT * FROM calculations WHERE case_id = ? ORDER BY created_at DESC', [caseId]);
  }
}

// Database operations for documents
export class DocumentService {
  static async create(docData: Omit<Document, 'id' | 'created_at'>): Promise<number> {
    const db = await openDb();
    const result = await db.run(
      `INSERT INTO documents (case_id, name, type, jdf_form, content, file_path) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [docData.case_id, docData.name, docData.type, docData.jdf_form, docData.content, docData.file_path]
    );
    return result.lastID;
  }
  
  static async findByCase(caseId: number): Promise<Document[]> {
    const db = await openDb();
    return db.all('SELECT * FROM documents WHERE case_id = ? ORDER BY created_at DESC', [caseId]);
  }
}

export default { openDb, initDatabase, CaseService, CalculationService, DocumentService };