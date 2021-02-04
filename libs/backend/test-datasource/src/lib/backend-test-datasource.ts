import { IDaoConfig, MYSQLConnectionConfig, QueryServerDatabase } from '@sculify/node-room';

async function generate_test_data(daoConfig: IDaoConfig, MYSQL_CONFIG: MYSQLConnectionConfig, db_instance_name: string) {
    

}

export async function add_test_data(MYSQL_CONFIG: MYSQLConnectionConfig, db_instance_name: string) {
    const serverQuery = new QueryServerDatabase(MYSQL_CONFIG, db_instance_name);

    try {
        await generate_test_data({ runType: 'normal', serverQuery: serverQuery, asyncServerQuery: serverQuery }, MYSQL_CONFIG, db_instance_name);
        serverQuery.dispose_connection();
        return 'OK';
    } catch (error) {
        console.error(error, 'error');
        serverQuery.dispose_connection();
    }
}
