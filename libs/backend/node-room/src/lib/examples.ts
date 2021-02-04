import { BaseDao } from './dao/dao-base-class';
export { BaseDao } from './dao/dao-base-class';

import { Query } from './dao/dao-decorator';
export { Query } from './dao/dao-decorator';

import { Database } from './database/database-decorator';
export { UUIDManager } from './database/database-wrapper/uuid_manager';
export { Database } from './database/database-decorator';

import { IDao, IDaoConfig } from './main-interface';
export { IDao, IDaoConfig } from './main-interface';

export { DatabaseWrapper } from './database/database-wrapper/database-wrapper';
export { DatabaseConnection } from './database/database-wrapper/database_connection';

import { Table } from "./table/table-decorator";
export { Table } from "./table/table-decorator";

import { Column } from './table/table-property-decorator';
export { Column } from './table/table-property-decorator';

import { MYSQL_DATATYPE } from './utils';
export { MYSQL_DATATYPE } from './utils';

import { View } from './view/view-decorator';
export { View } from './view/view-decorator';


// examples
@View({ view_name: 'student_table', query: 'SELECT name, age FROM student_table WHERE name = :name AND age = :age' })
@Table({ primaryKey: 'student_id', tableName: 'kllll' })
class student_table {
    constructor(name: string) { }
    [x: string]: any;

    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private student_id: undefined

    @Column({ dataType: MYSQL_DATATYPE.CHAR() })
    private student_name: undefined

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(12) })
    private mobile_number: undefined

    @Column({ dataType: MYSQL_DATATYPE.INT(false) })
    private age: undefined

    @Column({ dataType: MYSQL_DATATYPE.ENUM(['male', 'female', 'other']) })
    private gender: undefined

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: undefined

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: undefined
}


// console.log((new student_table('Harry Potter') as any).generateViewQuery())
// console.log((new student_table('Robert') as any).generateTableQuery())


// dao
class get_students extends BaseDao<{ name: string; age: number }[]>   {
    constructor(config: IDaoConfig) {
        super(config)
    }

    @Query('SELECT name, age from student_table where name = :name AND age = :age')
    fetch(name: string, age: number) { }
}

// const jk = new get_students({})
// jk.fetch('Harry', 12)
// jk.fetch('Prasenjeet Symon', 14)

@Database({
    db_name: 'student_database',
    Tables: [],
    Views: [
        { entity: student_table, cache_fetch_condition: 'student_id = :student_id' }
    ],
    childDatabase: []
})
class MainDatabase {
    private static instance: MainDatabase;

    constructor(student_id: number, age?: number) { }

    public get_students = get_students

    public static initInstance(student_id: number, age?: number): void {
        if (!MainDatabase.instance) {
            MainDatabase.instance = new MainDatabase(student_id, age);
        }
    }

    public static getInstance(): MainDatabase {
        return MainDatabase.instance;
    }
}


// MainDatabase.initInstance(12, 12)
// const kl = MainDatabase.getInstance()
// console.log(kl['get_students'].name, 'dao original name')
// console.log((kl as any).getDao('get_students'), 'dao found')