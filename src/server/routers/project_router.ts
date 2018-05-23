import { AbstractRouter } from './abstract_router';
import { ProjectHandler } from '../handlers/project_handler';

export class ProjectRouter extends AbstractRouter {

    setup() {
        let config = {};
        const handler = new ProjectHandler();
        this.register(config, "create", handler.create);
        return config;
    }

}

export default new ProjectRouter().router;
