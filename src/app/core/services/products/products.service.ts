import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
  addNewRatingMutation,
  addProductMutation,
  addToWishlistMutation,
  deleteProductMutation,
  getProductByIdQuery,
  getProductPriceSuggestionQuery,
  getProductsByUserIdQuery,
  getProductsQuery,
  getUserWishlistQuery,
  removeFromWishlistMutation,
  updateProductMutation,
} from '../../graphql/product.graphql';
import { CommentsService } from '../comments/comments.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(
    private apollo: Apollo,
    private commentsService: CommentsService,
    private userService: UserService
  ) {}

  getProducts(): Observable<Array<Product>> {
    return this.apollo
      .watchQuery<any>({
        query: getProductsQuery,
        pollInterval: 10000,
      })
      .valueChanges.pipe<Array<Product>>(
        map(({ data, loading }) => {
          if (!loading) {
            let products = data.getProducts || [];
            products = products.map((product) => {
              return this.mapProductForClient(product);
            });
            return products as Array<Product>;
          } else {
            return [];
          }
        })
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.apollo
      .query<any>({
        query: getProductByIdQuery,
        variables: {
          productId: id,
        },
        fetchPolicy: 'network-only',
      })
      .pipe<Product>(
        map(({ data }) => {
          return this.mapProductForClient(data.getProductById);
        })
      );
  }

  getProductsByUserId(userId: string): Observable<Array<Product>> {
    return this.apollo
      .query<any>({
        query: getProductsByUserIdQuery,
        variables: {
          userId,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          let products = data.getProductsByUserId;
          products = products.map((product) => {
            return this.mapProductForClient(product);
          });
          return products as Array<Product>;
        })
      );
  }

  addProduct(
    ownerId: string,
    categoryId: string,
    product
  ): Observable<Product> {
    let newProduct = {
      ...product,
      ownerId,
      categoryId,
    };
    return this.apollo
      .mutate<any>({
        mutation: addProductMutation,
        variables: {
          product: newProduct,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          return this.mapProductForClient(data.addProduct) as Product;
        })
      );
  }

  updateProduct(
    productId: string,
    categoryId: string,
    product
  ): Observable<Product> {
    let newProduct = { ...product, categoryId: categoryId };
    return this.apollo
      .mutate<any>({
        mutation: updateProductMutation,
        variables: {
          productId,
          product: newProduct,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          return this.mapProductForClient(data.updateProduct) as Product;
        })
      );
  }

  deleteProduct(productId: string): Observable<boolean> {
    return this.apollo
      .mutate<any>({
        mutation: deleteProductMutation,
        variables: {
          productId,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          return data.removeProduct;
        })
      );
  }

  getUserWishlist(userId: string): Observable<Array<Product>> {
    return this.apollo
      .watchQuery<any>({
        query: getUserWishlistQuery,
        variables: {
          userId,
        },
        pollInterval: 10000,
      })
      .valueChanges.pipe(
        map(({ data, errors }) => {
          let products = data.getUserWishList;
          products = products.map((product) => {
            return this.mapProductForClient(product);
          });
          return products as Array<Product>;
        })
      );
  }

  addProductToWishlist(
    userId: string,
    productId: string
  ): Observable<Array<Product>> {
    return this.apollo
      .mutate<any>({
        mutation: addToWishlistMutation,
        variables: {
          userId,
          productId,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          let products = data.addToWishList.wishList;
          products = products.map((product) => {
            return this.mapProductForClient(product);
          });
          return products as Array<Product>;
        })
      );
  }

  removeProductFromWishlist(
    userId: string,
    productId: string
  ): Observable<Array<Product>> {
    return this.apollo
      .mutate<any>({
        mutation: removeFromWishlistMutation,
        variables: {
          userId,
          productId,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          let products = data.removeFromWishList.wishList;
          products = products.map((product) => {
            return this.mapProductForClient(product);
          });
          return products as Array<Product>;
        })
      );
  }

  addNewRating(productId: string, rating: number): Observable<Product> {
    return this.apollo
      .mutate<any>({
        mutation: addNewRatingMutation,
        variables: {
          productId,
          rating,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          return this.mapProductForClient(data.addNewRating) as Product;
        })
      );
  }

  getProductPriceSuggestion(productId): Observable<number> {
    return this.apollo
      .query<any>({
        query: getProductPriceSuggestionQuery,
        variables: {
          productId,
        },
      })
      .pipe(
        map(({ data, errors }) => {
          return data.getProductPriceSuggestion;
        })
      );
  }

  mapProductForClient(serverProduct): Product {
    if (serverProduct) {
      return {
        ...serverProduct,
        owner: this.userService.mapUserForClient(serverProduct.owner),
        pictureLinks: JSON.parse(serverProduct.pictureLinks),
        comments: serverProduct.comments.map((comment) =>
          this.commentsService.mapCommentForClient(
            comment,
            this.userService.mapUserForClient
          )
        ),
      };
    }
  }
}
