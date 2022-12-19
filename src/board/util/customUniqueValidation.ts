import { Injectable } from "@nestjs/common"
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { BoardService } from "../board.service";

export function Unique(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: CustomNameValidation
        })
    }
}


@ValidatorConstraint({ name: 'name', async: true })
@Injectable()
export class CustomNameValidation implements ValidatorConstraintInterface {
    constructor(private readonly boardService: BoardService) {}

    async validate(value: string, args: ValidationArguments): Promise<boolean> {
        return this.boardService.Validate(value);
        return false;
    }

    defaultMessage(args: ValidationArguments) {
        return `이미 존재하는 이름 입니다.`;
    }
}
