/*
There must me UUIDmanager inited before use of the node room
This class exit because we do not need direct dependency on the UUID library
*/
export class UUIDManager {
    private static instance: UUIDManager;

    private constructor(private uuidF: () => string) {}

    public static initInstance = (uuidF: () => string) => {
        if (!UUIDManager.instance) {
            UUIDManager.instance = new UUIDManager(uuidF);
        }
    };

    public static getInstance = () => {
        return UUIDManager.instance;
    };

    public uuid = () => {
        return this.uuidF();
    };
}

/** mysql taker */

export class MYSQLManager {
    private static instance: MYSQLManager;
    public mysql: any;

    private constructor(mysql: any) {
        this.mysql = mysql;
    }

    public static initInstance = (mysql: any) => {
        if (!MYSQLManager.instance) {
            MYSQLManager.instance = new MYSQLManager(mysql);
        }
    };

    public static getInstance = () => {
        return MYSQLManager.instance;
    };
}

/** nodejs module only */

export class NodeJsModules {
    private static instance: NodeJsModules;
    public nodeModule: any;

    private constructor(nodeModule: any) {
        this.nodeModule = nodeModule;
    }

    public getModule(name: string) {
        return this.nodeModule[name];
    }

    public static initInstance = (nodeModule: any) => {
        if (!NodeJsModules.instance) {
            NodeJsModules.instance = new NodeJsModules(nodeModule);
        }
    };

    public static getInstance = () => {
        return NodeJsModules.instance;
    };
}
