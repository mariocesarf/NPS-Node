import {MigrationInterface, QueryRunner, Table, Timestamp} from "typeorm";

export class CreateSurveys1614214764129 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "surveys",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true

                },
                {
                    name: "title",
                    type: "varchar"
                },
                {
                    name: "description",
                    type: "varchar"
                },
                {
                    name: "createdAt",
                    type: "Timestamp",
                    default: "now()"
                }
            ]

        }
        ));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("surveys");
    }

}
