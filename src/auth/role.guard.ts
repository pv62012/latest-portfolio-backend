import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class RoleGuard implements CanActivate {
    private rolePassed: Array<string>;

    constructor(roles: Array<string>) {
        this.rolePassed = roles
    }

    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToHttp();
        const request: any = ctx.getRequest<Request>();
        return this.rolePassed.includes(request.user.role)
    }
}