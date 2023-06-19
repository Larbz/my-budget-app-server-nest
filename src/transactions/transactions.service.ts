import { Injectable, Request, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Aggregate,
  Document,
  Model,
  PipelineStage,
  Query,
} from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsFilters } from './dto/get-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transactions } from './schema/transactions.schema';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions.name)
    private transactionsModel: Model<Transactions>,
  ) {}
  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async findAll(
    filters: GetTransactionsFilters,
    userId: string,
    @Response() res,
  ) {
    const limit: number = parseInt(filters.limit) || 10;
    const page: number = parseInt(filters.page as string) || 1;
    const skip: number = limit * (page - 1);
    const name: string = filters.name;
    const queryParams = parseQueryParams({
      ...filters,
      userId: new mongoose.Types.ObjectId(userId),
    } as unknown as myOwnQuery);

    const finalFilters = {
      ...{ $match: queryParams },
      // ...{ $sort: { date: 1 } },
      ...{ $skip: skip },
      ...{ $limit: limit },
      ...{
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      ...{
        $unwind: {
          path: '$category',
        },
      },
      ...{
        $project: {
          categoryId: 0,
          'category.__v': 0,
          'category._id': 0,
        },
      },
    };

    const filterToCount = {
      ...{ $match: queryParams },
    };

    const arr = Object.entries(finalFilters).map(([value1, value2]) => {
      const objeto: { [clave: string]: any } = {};
      objeto[value1] = value2;
      return objeto;
    });

    const arrForCount = Object.entries(filterToCount).map(
      ([value1, value2]) => {
        const objeto: { [clave: string]: any } = {};
        objeto[value1] = value2;
        return objeto;
      },
    );

    if (name) {
      arrForCount.unshift({
        $search: {
          index: 'autoComplete',
          autocomplete: {
            query: name,
            path: 'nameOfTransaction',
            tokenOrder: 'sequential',
          },
        },
      });
      arr.unshift({
        $search: {
          index: 'autoComplete',
          autocomplete: {
            query: name,
            path: 'nameOfTransaction',
            tokenOrder: 'sequential',
          },
        },
      });
    }

    let count:
      | Aggregate<any[]>
      | Query<
          number,
          Document<unknown, object, Transactions> &
            Omit<
              Transactions & {
                _id: mongoose.Types.ObjectId;
              },
              never
            >,
          object,
          Transactions
        >;
    if (name) {
      count = this.transactionsModel.aggregate(
        arrForCount as unknown as PipelineStage[],
      );
    } else {
      count = this.transactionsModel.count(queryParams);
    }

    const transactions = this.transactionsModel.aggregate(
      arr as unknown as PipelineStage[],
    );

    try {
      const [countResult, transactionsResult] = await Promise.all([
        count,
        transactions,
      ]);
      if (transactionsResult.length !== 0) {
        let contador: number;
        if (typeof countResult == 'number') {
          contador = countResult;
        } else {
          contador = countResult.length;
        }
        const totalPages = Math.ceil(contador / limit);
        const currentPage = page;
        return res.status(200).json({
          res: true,
          totalResults: contador,
          currentPage,
          totalPages,
          count: transactionsResult.length,
          data: transactionsResult,
        });
      } else {
        res.header(
          'X-Message',
          'No se encontraron resultados con los filtros indicados',
        );
        res.status(204);
        res.end();
      }
    } catch (err) {
      console.error('Error al ejecutar las consultas:', err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

function parseQueryParams(query: myOwnQuery): myOwnQuery {
  const queryParams: myOwnQuery = {} as myOwnQuery;
  queryParams.userId = query.userId;
  if (query.beforeThan !== undefined || query.afterThan !== undefined) {
    let fecha;
    if (query.beforeThan !== undefined) {
      fecha = new Date(query.beforeThan);
      fecha.setDate(fecha.getDate() + 1);
    }

    queryParams.date = {
      ...(query.afterThan && { $gte: new Date(query.afterThan) }),
      ...(query.beforeThan && { $lt: fecha }),
    };
  }
  if (query.lowerThan !== undefined || query.greaterThan !== undefined) {
    queryParams.amount = {
      ...(query.greaterThan && { $gte: parseInt(query.greaterThan) }),
      ...(query.lowerThan && { $lte: parseInt(query.lowerThan) }),
    };
  }

  if (query.categoryId !== undefined) {
    queryParams.categoryId = new mongoose.Types.ObjectId(query.categoryId);
  }
  // if (query.name !== undefined) {
  //     queryParams.nameOfTransaction = {
  //         ...(query.name && { $regex: RegExp(`\\b${query.name}.*\\b`, "gmi") }),
  //         // ...(query.name && { $regex: RegExp(`${query.name}`, "gmi") }),
  //     };

  // queryParams.$text={
  //     ...(query.name && { $search: query.name }),
  // }
  // }

  return queryParams;
}
interface myOwnQuery {
  userId: mongoose.Types.ObjectId;
  beforeThan?: string;
  afterThan?: string;
  lowerThan?: string;
  date?: {
    $gte?: Date;
    $lt?: Date;
  };
  greaterThan?: string;
  nameOfTransaction?: {
    $regex?: RegExp;
  };
  name?: string;
  // $text?:{
  //     $search?:string;
  // },
  amount?: {
    $gte?: number;
    $lte?: number;
  };
  categoryId?: mongoose.Types.ObjectId;
}
