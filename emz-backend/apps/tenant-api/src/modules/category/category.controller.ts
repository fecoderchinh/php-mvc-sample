import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Get,
    Req,
    UseGuards,
    Delete,
    Param,
    UsePipes
} from '@nestjs/common';
import { CategoryService } from 'shared/services/tenant/category.service';
import { CreateCategoryDto } from 'shared/dtos/tenant/category/create.category.dto';
import {ApiTags, ApiHeader, ApiBearerAuth} from '@nestjs/swagger';
import { TenantHaders } from '@emzmono/common/constances/swagger.constance';
import {JwtAuthGuard} from "@emzmono/auth/jwt-auth.guard";
import {ResponseSuccess} from "@emzmono/common/interfaces/success-response.interface";
import {CategoryResponse} from "./responses/category.response";
import {IResponse} from "@emzmono/common/interfaces/response.interface";
import { IPaginatorResponse } from "shared/paginator";
import { PaginatorResponse } from "@emzmono/common/responses/paginator.response";
import { ObjectID } from "mongodb";

import {RouteParamPipe} from "@emzmono/common/pipes/route-param.pipe";
import {ICategoryPaginator} from "../../../../../shared/schemas/tenant/category.schema";
import {CategoriesResponse} from "./responses/categories.response";
import {CategoryPaginatorResponse} from "./responses/category-paginator.response";

@ApiTags('category')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {

    }

    @Post()
    @ApiBearerAuth()
    @ApiHeader(TenantHaders)
    @UseGuards(JwtAuthGuard)
    @HttpCode( HttpStatus.OK )
    async create(@Req() req, @Body() body: CreateCategoryDto): Promise<IResponse> {
        const category = await this.categoryService.create(req.user.id, body);
        return new ResponseSuccess(new CategoryResponse(category));
    }

    @Get()
    @ApiBearerAuth()
    @ApiHeader(TenantHaders)
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async index(@Req() request) : Promise<IPaginatorResponse|CategoriesResponse> {
        const result = await this.categoryService.getList(request.query);

        if (request.query.limit && Number(request.query.limit) === 0) {
            return new CategoriesResponse(result);
        }

        return new PaginatorResponse(new CategoryPaginatorResponse(result as ICategoryPaginator));
    }

    @UsePipes(RouteParamPipe)
    @Get(':id')
    @ApiBearerAuth()
    @ApiHeader(TenantHaders)
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async show(@Param('id') id:ObjectID) : Promise<IResponse> {
        const category = await this.categoryService.getDetail(id);

        return new ResponseSuccess(new CategoryResponse(category));
    }

    @UsePipes(RouteParamPipe)
    @Delete(':id')
    @ApiBearerAuth()
    @ApiHeader(TenantHaders)
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async destroy(@Param('id') id:ObjectID) : Promise<IResponse> {
        await this.categoryService.destroy(id);
        return new ResponseSuccess({});
    }
}